import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const tick = document.querySelector(".checkmark");
    tick.classList.add("animate");
  }, []);

  const handleHomeRedirect = () => {
    navigate("/");
  };

  return (
    <div
      className="text-white flex items-center justify-center flex-col"
      style={{
        textAlign: "center",
        padding: "40px",
        backgroundColor: "#09081d",
        borderRadius: "10px",
        boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="checkmark-wrapper" style={{ marginBottom: "20px" }}>
        <svg
          className="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
          style={{
            width: "150px",
            height: "150px",
            stroke: "#4CAF50",
            fill: "none",
            strokeWidth: "5px",
            strokeDasharray: "166",
            strokeDashoffset: "166",
            animation: "stroke 1s ease forwards",
          }}
        >
          <circle
            cx="26"
            cy="26"
            r="20"
            fill="none"
            style={{ stroke: "#4CAF50" }}
          />
          <path
            fill="none"
            d="M14 27l8 8 16-16"
            style={{
              stroke: "#4CAF50",
              strokeDasharray: "48",
              strokeDashoffset: "48",
              animation: "stroke 0.5s ease 0.5s forwards",
            }}
          />
        </svg>
      </div>
      <h1
        style={{ marginBottom: "10px", fontSize: "28px", fontWeight: "bold" }}
      >
        Payment Successful!
      </h1>
      <p style={{ marginBottom: "20px", fontSize: "18px" }}>
        Thank you for your payment. Your transaction was completed successfully.<br/> Please check your email for the ticket.
      </p>
      <button
        onClick={handleHomeRedirect}
        className="hover:text-blue-400 transition-all duration-300 ease-in-out font-bold"
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          border: "none",
          color: "#fff",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
      >
        Go to Home
      </button>
      <style>{`
        @keyframes stroke {
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate {
          animation: stroke 1s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
