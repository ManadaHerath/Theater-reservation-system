"use client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import validator from "validator";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleSignInButton from "../User Login/SignInButton";

export default function Register_Form() {
  const inputStyles =
    "w-full px-5 py-3 rounded-lg font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-2 bg-[#302E30] text-white focus:border-white";
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorcolour, setErrorcolour] = useState("");
  const [alert, setAlert] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertStyle, setAlertStyle] = useState("");

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
    if (
      validator.isStrongPassword(e.target.value, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      setErrorMessage("Is Strong Password");
      setErrorcolour("green");
    } else {
      setErrorMessage(
        "Is Not Strong Password(Use more than 6 characters, a mix of uppercase and lowercase letters, numbers, and symbols.)"
      );
      setErrorcolour("red");
    }
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password && e.target.value !== password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };
  const getAlertStyles = (type) => {
    switch (type) {
      case "green":
        return "text-green-600 text-xs mt-1";
      case "red":
        return "text-red-600 text-xs mt-1";
      default:
        return "";
    }
  };

  const onsubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/auth/register", {
        email: email,
        phone_number: phone,
        full_name: firstName + " " + lastName,
        gender: selectedOption,
        avatar: "",
        address: address,
        birthday: dateValue,
        role: "customer",
        is_completed: 0,
        is_active: 0,
        stripe_customer_id: "",
        password: password,
      });
      if (response.status === 400) {
        setAlert("Email already registered");
        setAlertStyle("text-red-600 text-s mt-1 flex justify-center");
      } else {
        setAlert("User added successfully");
        setAlertStyle("text-green-600 text-s mt-1 flex justify-center");
        setTimeout(() => {
          setAlert("");
          window.location.href = "/login";
        }, 3000);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setAlert("Email already registered");
        setAlertStyle("text-red-600 text-s mt-1 flex justify-center");
      } else {
        console.error("Error registering user:", err);
      }
    }
    //reset the form
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setDateValue("");
    setSelectedOption("");
    setPassword("");
    setConfirmPassword("");
    setTimeout(() => {
      setAlert("");
    }, 5000);
  };
  return (
    <div className="flex flex-col justify-center items-center w-full h-full bg-[#282D2D] px-5">
      <div
        className="xl:max-w-3xl bg-black
      }  w-full p-5 sm:p-10 rounded-md"
      >
        <h1
          className="flex justify-center text-xl sm:text-3xl font-semibold 
          text-white
        "
        >
          Register for a free account
        </h1>
        <form onSubmit={onsubmit}>
          <div className="w-full mt-8">
            <div className="mx-auto max-w-xs sm:max-w-md md:max-w-lg flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  className={inputStyles}
                  name="firstName"
                  type="text"
                  value={firstName}
                  pattern="^[A-Za-z]+$"
                  title="First name should only contain letters"
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your first name"
                  required
                />
                <input
                  className={inputStyles}
                  name="lastName"
                  type="text"
                  placeholder="Your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  pattern="^[A-Za-z]+$"
                  title="Last name should only contain letters"
                />
              </div>
              <input
                className={inputStyles}
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
                title="Enter a valid email"
                autoComplete="email"
              />
              <input
                className={inputStyles}
                name="contactnumber"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                pattern="^\d{10}$"
                title="Phone number should be 10 digits"
              />
              <textarea
                className={inputStyles}
                name="address"
                type="address"
                placeholder="Enter your Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoComplete="address"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative w-full">
                  <input
                    className={inputStyles}
                    id="date"
                    name="date"
                    type="date"
                    required
                    value={dateValue}
                    onChange={(e) => setDateValue(e.target.value)}
                    onFocus={(e) => (e.target.style.color = "#ffffff")}
                    onBlur={(e) =>
                      (e.target.style.color = e.target.value
                        ? "#ffffff"
                        : "transparent")
                    }
                    style={{ color: dateValue ? "#ffffff" : "transparent" }}
                  />
                  <label
                    htmlFor="date"
                    id="date"
                    className={`absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none transition-all duration-300 ${
                      dateValue ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    Date of Birth
                  </label>
                </div>
                <select
                  name="gender"
                  className={`${inputStyles}`}
                  value={selectedOption}
                  onChange={handleOptionChange}
                  required
                >
                  <option value="" disabled hidden>
                    Gender
                  </option>

                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <svg
                  className="w-4 h-4 absolute left-5 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div style={{ position: "relative", display: "inline-block" }}>
                <input
                  name="password"
                  className={inputStyles}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
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
              {errorMessage && (
                <p className={`${getAlertStyles(errorcolour)}`}>
                  {errorMessage}
                </p>
              )}
              <div style={{ position: "relative", display: "inline-block" }}>
                <input
                  name="Confirm password"
                  className={inputStyles}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  style={{ paddingRight: "40px" }}
                  required
                />
                <span
                  onClick={toggleShowConfirmPassword}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "grey",
                  }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}
              <button
                type="submit"
                disabled={password !== confirmPassword}
                className="mt-5 tracking-wide font-semibold bg-[#E9522C] text-gray-100 w-full py-4 rounded-lg hover:bg-[#E9522C]/90 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              >
                <svg
                  className="w-6 h-6 -ml-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6M23 11h-6" />
                </svg>
                <span className="ml-3">Register</span>
              </button>
              {alert && <p className={alertStyle}>{alert}</p>}
              <p className="mt-6 text-xs text-gray-600 text-center">
                Already have an account?{" "}
                <Link to={"/login"}>
                  <span className="text-[#E9522C] font-semibold">Login</span>
                </Link>
              </p>
              <div className="my-3 text-center">
                <GoogleSignInButton />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
