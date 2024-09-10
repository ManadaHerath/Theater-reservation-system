import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";

const RequestRefund = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [refundRequested, setRefundRequested] = useState(false);

  const handleRefundClick = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Make the API call to request a refund using the token from URL
      const response = await axios.post(
        `http://localhost:5001/refund/${token}`
      );

      // Assuming a successful response contains a success message
      if (response.status === 200) {
        setSuccessMessage("Refund request has been submitted successfully!");
        setRefundRequested(true);
      } else {
        setError("Failed to submit refund request. Please try again.");
      }
    } catch (err) {
      setError(
        "An error occurred while submitting the refund request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <div className="container mx-auto px-4 py-8 mt-8">
        <h1 className="text-3xl text-gray-100 font-bold text-center mb-4">
          Request Refund
        </h1>
        <p className="text-lg text-gray-100 mb-6 text-center">
          If you are not satisfied with the movie you have rented, you can
          request a refund within 24 hours of renting the movie.
        </p>

        {!refundRequested && (
          <div className="flex justify-center mb-6">
            <button
              onClick={handleRefundClick}
              disabled={loading}
              className={`px-6 py-3 rounded-md font-semibold text-white ${
                loading
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-blue-900 hover:bg-blue-700"
              }`}
            >
              {loading ? "Submitting..." : "Request Refund"}
            </button>
          </div>
        )}

        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <p className="text-lg text-gray-100 text-center">
          Please note that you can only request a refund for the movies you have
          rented. You cannot request a refund for the movies you have purchased.
        </p>
      </div>
    </div>
  );
};

export default RequestRefund;
