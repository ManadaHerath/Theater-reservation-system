import dotenv from "dotenv";
import { connection } from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
dotenv.config();

export const register = async (req, res, next) => {
  try {
    const {
      email,
      phone_number,
      full_name,
      gender,
      avatar,
      address,
      birthday,
      role,
      is_completed,
      is_active,
      stripe_customer_id,
      password,
    } = req.body;

    // Check if the email already exists
    const [existingUsers] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultAvatar =
      "https://firebasestorage.googleapis.com/v0/b/medilink-812fc.appspot.com/o/person.png?alt=media&token=510412a5-bfd5-423d-b65d-f3b2a206e88d";

    const [result] = await connection.query(
      "INSERT INTO users (email, phone_number, full_name, gender, avatar, address, birthday, role, is_completed, is_active, stripe_customer_id, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        email,
        phone_number,
        full_name,
        gender,
        avatar || defaultAvatar,
        address,
        birthday,
        role,
        is_completed,
        is_active,
        stripe_customer_id,
        hashedPassword,
      ]
    );

    // Return the newly created user with the inserted id
    res.status(201).json({
      email,
      phone_number,
      full_name,
      gender,
      avatar,
      address,
      birthday,
      role,
      is_completed,
      is_active,
      stripe_customer_id,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    

    // Find the user with the given email
    const [users] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(203).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    if (!user.password) {
      return res.status(203).json({ message: "Please sign in with Google" });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(203).json({ message: "Invalid credentials" });
    }
    console.log(user);
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
      return next(error); // Ensure we return to avoid sending headers again
    }

    // Set the cookie and send the response
    res.cookie("access_token", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      domain:process.env.COOKIE_DOMAIN,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find the user with the given email
    const [users] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(201).json({ message: "No user with this email found" });
    }

    const user = users[0];

    // Return the user
    res.status(200).json({
      message: "The password reset OTP has been sent to your email",
    });
  } catch (error) {
    console.error("Error sending password reset link:", error);
    next(error);
  }
};
