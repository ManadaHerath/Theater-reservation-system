import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavBar from "../components/NavBar";

const RequestRefund = () => {
    const { token } = useParams(); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleRefundClick = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Make the API call to request a refund using the token from URL
            const response = await axios.post(`http://localhost:5001/refund/${token}`);
            
            // Assuming a successful response contains a success message
            if (response.status === 200) {
                setSuccessMessage("Refund request has been submitted successfully!");
            } else {
                setError("Failed to submit refund request. Please try again.");
            }
        } catch (err) {
            setError("An error occurred while submitting the refund request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="container">
                <h1>Request Refund</h1>
                <p>
                    If you are not satisfied with the movie you have rented, you can request a refund within 24 hours of renting the movie.
                </p>

                <button onClick={handleRefundClick} disabled={loading}>
                    {loading ? "Submitting..." : "Request Refund"}
                </button>

                {successMessage && <p className="success">{successMessage}</p>}
                {error && <p className="error">{error}</p>}

                <p>
                    Please note that you can only request a refund for the movies you have rented. You cannot request a refund for the movies you have purchased.
                </p>
            </div>
        </div>
    );
};

export default RequestRefund;
