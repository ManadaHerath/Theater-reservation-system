"use client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleSignInButton from "./SignInButton";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alertStyle, setAlertStyle] = useState("");

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const inputStyles =
    "w-full px-5 py-3 rounded-lg font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-2 bg-[#302E30] text-white focus:border-white";

  const onsubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setAlert("Successfullly Logged In");
        setEmail("");
        setPassword("");
        setAlertStyle("text-green-600 text-s mt-1 flex justify-center");
      } else {
        setAlert(data.message);
        setAlertStyle("text-red-600 text-s mt-1 flex justify-center");
      }
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      setAlert("");
    }, 5000);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-[#282D2D] px-5">
      <div className="xl:max-w-3xl bg-black w-full md:w-1/2 p-5 sm:p-10 rounded-md">
        <h1
          className="flex justify-center text-2xl sm:text-3xl font-semibold 
          text-white
        "
        >
          Login Now
        </h1>
        <form onSubmit={onsubmit}>
          <div className="w-full mt-8">
            <div className="mx-auto max-w-xs sm:max-w-md md:max-w-lg flex flex-col gap-4">
              <input
                className={inputStyles}
                name="email"
                type="email"
                value={email}
                title="Enter a valid email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
              />
              <div style={{ position: "relative", display: "inline-block" }}>
                <input
                  name="password"
                  className={inputStyles}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: "40px" }} // Make room for the icon
                />
                <span
                  onClick={toggleShowPassword}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "grey",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <button
                type="submit"
                className="mt-5 tracking-wide font-semibold bg-[#E9522C] text-gray-100 w-full py-4 rounded-lg hover:bg-[#E9522C]/90 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M17 10a2 2 0 012-2 2 2 0 012 2v4a2 2 0 01-2 2 2 2 0 01-2-2v-4z" />
                  <path d="M20 14v2m0 2h0" />
                </svg>

                <span className="ml-3">Login</span>
              </button>
              {alert && <p className={alertStyle}>{alert}</p>}
              <p className="mt-6 text-xs text-gray-600 text-center">
                Haven't Registered Yet?{" "}
                <Link to={"/register"}>
                  <span className="text-[#E9522C] font-semibold">Register</span>
                </Link>
              </p>
              <div className="mt-5 text-center">
                <GoogleSignInButton />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
