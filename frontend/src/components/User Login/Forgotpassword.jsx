"use client";
import React, { useState } from "react";

export default function () {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState("");
  const [password, setPassword] = useState("");
  const [alertStyle, setAlertStyle] = useState("");

  const onsubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5001/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
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
      }
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      setAlert("");
    }, 5000);
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <div className="flex justify-center items-center flex-col w-1/2 md:w-1/4 h-1/4 bg-gray-400  rounded-md ">
        <h1 className="text-md py-3 lg:text-lg">Enter Your Email Address</h1>
        <form
          className="flex flex-col justify-center items-center"
          onSubmit={onsubmit}
        >
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="px-2 h-9 rounded-sm w-36 md:w-42 lg:w-72 border-2 border-blue-500"
          />
          <button className="bg-blue-500 rounded-md p-2 my-3 font-semibold hover:bg-blue-300 text-sm lg:text-md">
            Send Email
          </button>
        </form>
      </div>
      {alert && <p className={alertStyle}>{alert}</p>}
    </div>
  );
}
