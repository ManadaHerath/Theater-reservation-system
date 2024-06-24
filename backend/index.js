import express from "express";
import mysql from "mysql2";
import authRoute from "./routes/auth.js";
import movieRoute from "./routes/movies.js";
import theatreRoute from "./routes/theatres.js";
import theatre_show_timesRoute from "./routes/theatre_Show_Times.js";
import show_timesRoute from "./routes/show_times.js";
import temp_purchaseRoute from "./routes/temp_purchase.js";
import usersRoute from "./routes/users.js";
import useRowsRoute from "./routes/rows.js";
import seatTypesRoute from "./routes/seat_types.js";
import purchasedSeatsRoute from "./routes/purchase.js";
import createCheckoutRoute from "./routes/payment.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { verifyToken } from "./util/verify_token.js";
import cors from "cors";
import session from "express-session";
import passport from "./controllers/GoogleSignIn.js";
import recoveryRoute from "./routes/recoveryPassword.js";

const app = express();
//for usage of google sign in
app.use(
  session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  Promise: global.Promise,
});

export const connection = pool.promise();

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});

// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoute);
app.use("/movies", movieRoute);
app.use("/theatres", theatreRoute);
app.use("/show_times", show_timesRoute);
app.use("/theatre_show_times", theatre_show_timesRoute);
app.use("/temp_purchase", temp_purchaseRoute);
app.use("/users", usersRoute);
app.use("/rows", useRowsRoute);
app.use("/seat_types", seatTypesRoute);
app.use("/purchased_seats", purchasedSeatsRoute);
app.use("/stripe", createCheckoutRoute);
app.use("/recovery", recoveryRoute);

// error
app.use((err, req, res, next) => {
  return res.status(500).json(err.message);
});
