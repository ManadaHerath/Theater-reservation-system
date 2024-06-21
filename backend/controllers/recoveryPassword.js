import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const OTP_STORE = {};

export const send_recovery_email = async (req, res) => {
  try {
    const { OTP, recipient_email } = req.body;
    OTP_STORE[recipient_email] = OTP;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "nadunnisith1@gmail.com",
        pass: "Asdf@1234",
      },
    });
    const mailOptions = {
      from: "nadunnisith1@gmail.com",
      to: recipient_email,
      subject: "Password Recovery",
      text: `Your OTP is ${OTP}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json("Email sent");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const verify_otp = async (req, res) => {
  try {
    const { OTP } = req.body;
    const storedOTP = OTP_STORE[recipient_email];
    if (storedOTP && OTP === storedOTP) {
      res.status(200).json({ message: "OTP is correct" });
    } else {
      res.status(201).json({ message: "OTP is incorrect" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
