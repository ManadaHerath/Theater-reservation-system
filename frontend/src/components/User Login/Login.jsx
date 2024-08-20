"use client";
import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleSignInButton from "./SignInButton";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alertStyle, setAlertStyle] = useState("");

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const inputStyles =
    "sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500";

  const onsubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/auth/login",
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const data = response.data;
      if (response.status === 200) {
        setAlert("Successfullly Logged In");

        setAlertStyle("text-green-600 text-s mt-1 flex justify-center");

        const accessToken = data?.token;
        const role = data?.role;
        setUser({ email, accessToken, role });
        setEmail("");
        setPassword("");
        if (role === "customer") {
          console.log("aaaaaaaa")
          navigate(from, { replace: true });
        }
        if (role === "admin") navigate("/", { replace: true });
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
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 w-screen bg-gray-900">
      <div className="w-full p-6  rounded-lg shadow border md:mt-0 sm:max-w-md bg-gray-800 border-gray-700 sm:p-8">
        <h1
          className="flex leading-tight tracking-tight justify-center text-2xl sm:text-3xl font-semibold 
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
              <Link to={"/forgot-password"}>
                <p className="text-xs text-gray-200 text-right mr-3">
                  Forgot Password?
                </p>
              </Link>
              <button
                type="submit"
                className="mt-1 tracking-wide font-semibold bg-[#E9522C] text-gray-100 w-full py-3 md:py-4 rounded-lg hover:bg-[#E9522C]/90 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
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
              <p className="mt-2 text-xs text-gray-200 text-center">
                Haven't Registered Yet?{" "}
                <Link to={"/register"}>
                  <span className="text-[#E9522C] font-semibold">Register</span>
                </Link>
              </p>
              <div className="mt-5 text-center">
                <GoogleSignInButton word="in" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
