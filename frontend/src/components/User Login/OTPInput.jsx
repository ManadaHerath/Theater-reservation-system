"use client";
import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

export default function OTPInput() {
  const location = useLocation();
  const [timerCount, setTimer] = React.useState(60);
  const [OTPinput, setOTPinput] = useState([null, null, null, null]);
  const [disable, setDisable] = useState(true);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [resendOTPAlert, setResendOTPAlert] = useState("");
  const [alertStyle, setAlertStyle] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailFromUrl = queryParams.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [location]);

  function resendOTP(email) {
    if (disable) return;
    setDisable(true);
    setTimer(60);
    axios
      .post("/recovery/send_recovery_email", {
        email: email,
      })
      .then(() => setResendOTPAlert(`New OTP sent to ${email}`))
      .then(() => setAlertStyle("text-green-500 text-center mt-1"))
      .then(() => setTimeout(() => setResendOTPAlert(""), 3000))
      .catch(console.log);
  }
  const [alert, setAlert] = useState("");

  const verfiyOTP = async (e) => {
    e.preventDefault();
    const otp = OTPinput.join("");
    console.log(otp);
    try {
      const response = await axios
        .post("/recovery/verify-otp", {
          OTP: otp,
        })
        .then((response) => {
          setAlert(response.status);
          if (response.status === 200) {
            setAlertStyle("text-green-500 text-center mt-1");

            setTimeout(() => {
              setAlert("");
              navigate(`/reset?email=${encodeURIComponent(email)}`);
            }, 4000);
          } else {
            setAlertStyle("text-red-500 text-center mt-1");
          }
        });
      setTimeout(() => {
        setAlert("");
      }, 5000);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        if (lastTimerCount <= 0) return lastTimerCount;
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, [disable]);

  return (
    <div className="flex justify-center items-center w-full h-screen bg-[#09081d]">
      <div className="bg-gray-800 border-gray-700 px-6 pt-10 pb-9 shadow-xl mx-auto lg:w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl text-white">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email {email}</p>
            </div>
          </div>

          <div>
            <form onSubmit={verfiyOTP}>
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs font-bold space-x-2">
                  <div className="w-16 h-16 ">
                    <input
                      maxLength="1"
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-xl lg:text-2xl bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      value={OTPinput[0]}
                      name=""
                      id="1"
                      required
                      onChange={(e) =>
                        setOTPinput([
                          e.target.value,
                          OTPinput[1],
                          OTPinput[2],
                          OTPinput[3],
                        ])
                      }
                    ></input>
                  </div>
                  <div className="w-16 h-16 ">
                    <input
                      maxLength="1"
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-xl lg:text-2xl bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      value={OTPinput[1]}
                      id="2"
                      required
                      onChange={(e) =>
                        setOTPinput([
                          OTPinput[0],
                          e.target.value,
                          OTPinput[2],
                          OTPinput[3],
                        ])
                      }
                    ></input>
                  </div>
                  <div className="w-16 h-16 ">
                    <input
                      maxLength="1"
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-xl lg:text-2xl bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id="3"
                      required
                      value={OTPinput[2]}
                      onChange={(e) =>
                        setOTPinput([
                          OTPinput[0],
                          OTPinput[1],
                          e.target.value,
                          OTPinput[3],
                        ])
                      }
                    ></input>
                  </div>
                  <div className="w-16 h-16 ">
                    <input
                      maxLength="1"
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-xl lg:text-2xl bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id="4"
                      required
                      value={OTPinput[3]}
                      onChange={(e) =>
                        setOTPinput([
                          OTPinput[0],
                          OTPinput[1],
                          OTPinput[2],
                          e.target.value,
                        ])
                      }
                    ></input>
                  </div>
                </div>

                <div className="flex flex-col space-y-5">
                  <div>
                    <button
                      type="submit"
                      className="flex flex-row cursor-pointer items-center justify-center text-center w-full border rounded-xl outline-none py-4 font-semibold bg-[#E9522C] border-none text-white text-md shadow-sm"
                    >
                      Verify Account
                    </button>
                  </div>

                  <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-200">
                    <p>Didn't recieve code?</p>{" "}
                    <a
                      className="flex flex-row items-center"
                      style={{
                        color: disable ? "gray" : "orange",
                        cursor: disable ? "none" : "pointer",
                        textDecorationLine: disable ? "none" : "underline",
                      }}
                      onClick={() => resendOTP(email)}
                    >
                      {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                    </a>
                  </div>
                  {alert === 200 ? (
                    <Alert severity="success">OTP Matched</Alert>
                  ) : (
                    alert === 201 && (
                      <Alert severity="error">OTP didn't matched</Alert>
                    )
                  )}
                  {resendOTPAlert && (
                    <p className={alertStyle}>{resendOTPAlert}</p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
