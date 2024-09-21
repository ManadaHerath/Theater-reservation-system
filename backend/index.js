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
import webHookRoute from "./routes/webhook.js";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "./controllers/GoogleSignIn.js";
import recoveryRoute from "./routes/recoveryPassword.js";
import refreshRoute from "./routes/refresh.js";
import logoutRoute from "./routes/logout.js";
import reviewsRoute from "./routes/reviews.js";
import movieReviewsRoute from "./routes/movie_reviews.js";
import photoUploadRoute from "./routes/photoUpload.js";
import refundRoute from "./routes/refundReq.js";
import theatreGrid from "./routes/theatre_grid.js";
import registrationRouter from "./routes/Admin_Panel/AdminDash.js";
import discountRouter from "./routes/discounts.js";

const app = express();
//for usage of google sign in
export default app;

app.use(
  session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

const corsOptions = {
  origin: "http://localhost:3000", // Frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(passport.initialize());
app.use(passport.session());

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
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
app.use("/webhook", webHookRoute);
app.use(express.json());
app.use(cookieParser());
app.use("/reviews", reviewsRoute);
app.use("/movie_reviews", movieReviewsRoute);
app.use("/refresh", refreshRoute);
app.use("/logout", logoutRoute);
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
app.use("/photo-upload", photoUploadRoute);
app.use("/refund", refundRoute);
app.use("/grid", theatreGrid);
app.use("/admin-dash", registrationRouter);
app.use("/coupons", discountRouter);
// error
app.use((err, req, res, next) => {
  return res.status(500).json(err.message);
});
