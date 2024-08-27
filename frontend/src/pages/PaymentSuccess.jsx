import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleHomeRedirect = () => {
    navigate("/");
  };

  return (
    <div
      className="text-white flex items-center justify-center flex-col"
      style={{ textAlign: "center", padding: "20px" }}
    >
      <h1>Payment Successful!</h1>
      <p>
        Thank you for your payment. Your transaction was completed successfully.
      </p>
      <button
        onClick={handleHomeRedirect} className="hover:text-blue-400 "
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        Go to Home
      </button>
    </div>
  );
};

export default PaymentSuccess;
