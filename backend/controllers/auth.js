import "dotenv/config";
import { connection } from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

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

    console.log(req.body);
    const [result] = await connection.query(
      "INSERT INTO users (email, phone_number, full_name, gender, avatar, address, birthday, role, is_completed, is_active, stripe_customer_id, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
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
        hashedPassword,
      ]
    );

    // Return the newly created user with the inserted id
    res.json({
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
      return res.status(201).json({ message: "No user with this email found" });
    }

    const user = users[0];

    if (!user.password) {
      return res.status(201).json({ message: "Please sign in with Google" });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(201).json({ message: "Invalid password" });
    }
    const role = user.role === "admin";
    const token = jwt.sign(
      { id: user.id, isAdmin: role },
      process.env.JWT_SECRET_KEY
    );
    // Return the user
    res.cookie("access_token", token, { httpOnly: true }).json({
      id: user.id,
      email: user.email,
      phone_number: user.phone_number,
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
    res.json({
      message: "The password reset link has been sent to your email",
    });
  } catch (error) {
    console.error("Error sending password reset link:", error);
    next(error);
  }
};
