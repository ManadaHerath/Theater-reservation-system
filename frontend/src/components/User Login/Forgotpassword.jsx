"use client";
import React, { useState } from "react";
import axios from "axios";

export default function () {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState("");
  const [alertStyle, setAlertStyle] = useState("");
  const [OTP, setOTP] = useState("");

  const onsubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5001/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (data.message === "No user with this email found") {
        setAlert(data.message);
        setAlertStyle(
          "text-red-600 text-s mt-1 flex justify-center mt-3 font-semibold"
        );
      } else if (
        data.message === "The password reset link has been sent to your email"
      ) {
        setAlert(data.message);
        setAlertStyle(
          "text-green-600 text-s mt-1 flex justify-center mt-3 font-semibold"
        );
        setTimeout(() => {
          setAlert("");
          navigateToOtp();
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      setAlert("");
    }, 5000);
  };

  function navigateToOtp() {
    setOTP(Math.floor(Math.random() * 9000 + 1000));
    console.log(OTP);

    axios
      .post("http://localhost:5001/recovery/send_recovery_email", {
        OTP,
        email,
      })
      .then(() => {
        window.location.replace(`/otp?email=${encodeURIComponent(email)}`);
      })
      .catch(console.log);
    return;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 flex-col">
      <div className="flex justify-center items-center flex-col w-1/2 md:w-1/4 h-1/4 bg-gray-800 border-gray-700 rounded-md ">
        <h1
          className="text-md py-3 md:text-xl sm:text-lg lg:text-2xl font-semibold 
          text-white px-2"
        >
          Enter Your Email Address
        </h1>
        <form
          className="flex flex-col justify-center items-center w-full px-2 lg:px-4"
          onSubmit={onsubmit}
        >
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="px-2 h-9 rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 border-2 py-2.5 text-white w-full text-sm sm:text-md md:text-lg"
          />
          <button className="font-semibold bg-[#E9522C] text-gray-100 w-full rounded-md p-2 my-3 text-md lg:text-lg">
            Send Email
          </button>
        </form>
      </div>
      {alert && <p className={alertStyle}>{alert}</p>}
    </div>
  );
}
