"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function () {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState("");
  const [alertStyle, setAlertStyle] = useState("");
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState("");
  const navigate = useNavigate();
  const onsubmit = async (e) => {
    setDisable(true);
    setLoading("Loading...");
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5001/recovery/send_recovery_email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      setAlert(data);
      if (response.status === 200) {
        setAlertStyle("text-green-600 text-s my-1 flex justify-center");
        setLoading("");
        setTimeout(() => {
          setAlert("");
          navigate(`/otp?email=${encodeURIComponent(email)}`);
        }, 3000);
      } else {
        setAlertStyle("text-red-600 text-s my-1 flex justify-center");
      }
      setTimeout(() => {
        setAlert("");
        setDisable(false);
        setLoading("");
      }, 5000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div  className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 w-full"
    style={{
      backgroundImage: `
    linear-gradient(rgba(43, 58, 110, 0.7), rgba(40, 40, 50, 0.7)),
    url('https://firebasestorage.googleapis.com/v0/b/medilink-5688e.appspot.com/o/images%2Falexander-andrews-A545KXf87jE-unsplash.jpg?alt=media&token=cc367a90-2066-4632-9b01-fd65861b6f51')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundColor: "#433B7C", 
    }}>
      <div className="flex justify-around items-center flex-col w-1/2 lg:w-1/4 h-1/2 bg-black bg-opacity-40 border-gray-700 rounded-md pb-3">
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
            className="px-2 h-9 rounded-lg bg-gray-800 border-gray-600 placeholder-gray-400 border-2 py-2.5 lg:py-5 text-white w-full text-sm sm:text-md md:text-lg"
          />
          <button
            className="font-semibold bg-[#E9522C] text-gray-100 w-full rounded-md p-2 my-3 text-md lg:text-lg lg:mt-20"
            disabled={disable}
          >
            Send Email
          </button>
          {alert && <p className={alertStyle}>{alert}</p>}
          {loading && (
            <p className="text-white text-s my-1 flex justify-center">
              {loading}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
