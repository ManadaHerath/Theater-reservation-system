import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
var OTP_STORE = 0;
import bcrypt from "bcrypt";
import { connection } from "../index.js";

export const send_recovery_email = async (req, res) => {
  try {
    const email = req.body.email; // Ensure these keys match the frontend
    //is email in the users table?
    const [users] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (users.length != 0) {
      const OTP = Math.floor(Math.random() * 9000 + 1000);
    console.log(OTP, email);
    OTP_STORE = OTP;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "methminguruge@gmail.com",
        pass: "hzptxutncghugziq",
      },
    });
    const mailOptions = {
      from: "methminguruge@gmail.com",
      to: email,
      subject: "Password Recovery",
      text: `Your OTP is ${OTP}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json("Error sending email");
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json(`Email sent to ${email}`);
      }
    });
    } else{
      res.status(201).json(`${email} not found` );}
    
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }

};

export const verify_otp = async (req, res) => {
  try {
    const { OTP } = req.body;
    const storedOTP = OTP_STORE;
    if (storedOTP && OTP == storedOTP) {
      res.status(200).json({ message: "OTP is correct" });
    } else {
      res.status(201).json({ message: "OTP is incorrect" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const resetPassword = async (req, res) => {
  try{
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [users] = await connection.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );
    res.status(200).json({ message: "Password changed successfully" });
  }
  catch(error){
    console.log(error);
    res.status(500).json(error);
  }
}
