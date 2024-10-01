import React from "react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#433B7C] to-[#2C497F]">
      <div className="text-center p-10 rounded-lg shadow-lg bg-white max-w-md">
        <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Unauthorized Access</h2>
        <p className="text-gray-500 mb-6">
          Oops! It seems like you don't have permission to view this page.
        </p>
        <button
          onClick={handleGoHome}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
