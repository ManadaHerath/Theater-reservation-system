import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { connection } from "../index.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      passReqToCallback: true, // This allows us to access `req` in the callback
    },
    async (req, res, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const fullName = profile.displayName;
        const photo = profile.photos[0].value;

        // Check if the user already exists
        const [existingUsers] = await connection.query(
          "SELECT * FROM users WHERE email = ?",
          [email]
        );

        let user;
        if (existingUsers.length > 0) {
          user = existingUsers[0];
          const role = user.role;
          const token = jwt.sign(
            { UserInfo: { id: user.id, role: role } },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "10s" }
          );

          const refreshToken = jwt.sign(
            { id: user.id, userName: user.email },
            process.env.REFRESH_SECRET_KEY,
            { expiresIn: "1d" }
          );

          // Save the refreshToken to the database with the user id
          try {
            await connection.query(
              "UPDATE users SET refresh_token = ? WHERE id = ?",
              [refreshToken, user.id]
            );
          } catch (error) {
            console.error("Error saving refresh token to the database:", error);
          }

          req.token = token; // Pass token to req for later use
          req.refreshToken = refreshToken;
          req.user = user;
        } else {
          // If the user does not exist, create a new user
          await connection.query(
            "INSERT INTO users (email, full_name, role, avatar, is_completed, is_active) VALUES (?, ?, ?, ?, ?, ?)",
            [email, fullName, "customer", photo, 0, 1]
          );

          const [users] = await connection.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
          );

          user = users[0];
          const refreshToken = jwt.sign(
            { id: user.id, userName: email },
            process.env.REFRESH_SECRET_KEY,
            { expiresIn: "1d" }
          );

          // Save the refreshToken to the database with the user id
          try {
            await connection.query(
              "UPDATE users SET refresh_token = ? WHERE id = ?",
              [refreshToken, user.id]
            );
          } catch (error) {
            console.error("Error saving refresh token to the database:", error);
          }

          const token = jwt.sign(
            { UserInfo: { id: user.id, role: "customer" } },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "10s" }
          );

          req.token = token; // Pass token to req for later use
          req.refreshToken = refreshToken;
          req.user = user;
        }

        return done(null, user);
      } catch (error) {
        console.error("Error during Google OAuth process:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [users] = await connection.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);
    done(null, users[0]);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
