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
      callbackURL: "http://localhost:5001/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const fullName = profile.displayName;
        const photo = profile.photos[0].value;

        // Check if the user already exists
        const [existingUsers] = await connection.query(
          "SELECT * FROM users WHERE email = ?",
          [email]
        );

        if (existingUsers.length > 0) {
          const user = existingUsers[0];
          const role = user.role === "admin";
          const token = jwt.sign(
            { id: user.id, isAdmin: role },
            process.env.JWT_SECRET_KEY
          );
          console.log("User exists, token:", token);
          return done(null, user);
        }

        // If the user does not exist, create a new user
        const [result] = await connection.query(
          "INSERT INTO users (email, full_name, role,avatar, is_completed, is_active) VALUES (?, ?, ?,?, ?, ?)",
          [email, fullName, "customer", photo, 0, 1]
        );

        const token = jwt.sign(
          { id: result.insertId, isAdmin: false },
          process.env.JWT_SECRET_KEY
        );
        console.log("New user created, token:", token);

        const newUser = {
          id: result.insertId,
          email: email,
          full_name: fullName,
          role: "customer",
          is_completed: 0,
          is_active: 1,
        };

        return done(null, newUser);
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
