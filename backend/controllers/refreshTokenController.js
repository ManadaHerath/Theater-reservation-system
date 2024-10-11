import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { connection } from "../index.js";
dotenv.config();

export const handleRefreshToken = async (req, res, next) => {
  const cookies = req.cookies;
  console.log("Cookies: refresh token ", cookies);

  if (!cookies?.access_token) return res.sendStatus(401);

  const refreshToken = cookies.access_token;

  // Find the user with the given refreshToken

  try {
    const [rows] = await connection.query(
      "SELECT * FROM users WHERE refresh_token = ?",
      [refreshToken]
    );

    if (rows.length === 0) {
      return res.sendStatus(403);
    } // Forbidden

    const user = rows[0];
    const role = user.role;

    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        console.log("Token expired or invalid bro.");
        return res.sendStatus(403);
      } //invalid token
      const token = jwt.sign(
        { UserInfo: { id: user.id, role: role } },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "60s" }
      );

      res.json({ role, token, user });
    });
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    res.sendStatus(500);
  }
};
