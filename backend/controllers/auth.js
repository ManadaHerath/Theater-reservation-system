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
    console.error("Error registering user:", error);
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
      return res.status(401).json("No user with this email found");
    }

    const user = users[0];

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json("Invalid password");
    }
    const role = user.role === "admin";
    const token = jwt.sign({ id: user.id, isAdmin: role }, process.env.JWT);
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
