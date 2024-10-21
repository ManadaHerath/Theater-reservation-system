import React, { useState, useEffect, useRef } from "react";
import QRScanner from "qr-scanner"; // Ensure QRScanner can access the camera
import TheatreAdminLayout from "../TheatreAdminLayout";
import Alert from "@mui/material/Alert";
import axios from 'axios'; // Make sure to install axios

// Scanner component for QR code scanning
export const Scanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null); // Reference for the video element

  const handleScan = async (result) => {
    if (result) {
      setScannedData(result.text);

      // Call API to verify the scanned QR code data
      try {
        const data = JSON.parse(result.text); // Assuming the scanned data is a JSON string
        const response = await axios.post('/purchased_seats/verify-ticket', {
          theatre_id: data.theatre_id,
          show_time_id: data.show_time_id,
          seats: data.seats,
          pi: data.pi,
          token: data.token,
        });

        if (response.data.valid) {
          setVerificationResult({ valid: true, message: response.data.message });
          setError(null);
        } else {
          setVerificationResult({ valid: false, message: response.data.message });
          setError(response.data.message);
        }
      } catch (err) {
        console.error("Error verifying ticket:", err);
        setError("Verification failed. Please try again.");
        setVerificationResult(null);
      }
    }
  };

  const handleError = (error) => {
    setError(error);
  };

  // UseEffect to start scanning
  useEffect(() => {
    let scanner; // Variable to hold the QRScanner instance
    if (isScanning) {
      // Initialize the QRScanner with the video element reference
      scanner = new QRScanner(videoRef.current, handleScan);
      scanner.start();

      return () => {
        scanner.stop(); // Cleanup on unmount
      };
    }
  }, [isScanning]);

  return (
    <div className="flex flex-col items-center p-6">
      {/* Button to start scanning */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg mb-4"
        onClick={() => setIsScanning(true)}
      >
        Start Scanning
      </button>

      {/* Video element for QR scanning */}
      {isScanning && (
        <video ref={videoRef} className="w-full h-80 border border-gray-400 rounded-lg mb-4" />
      )}
      
      {scannedData && (
        <p className="text-green-600 mt-4">Scanned Data: {scannedData}</p>
      )}

      {error && <Alert variant="filled" severity="error">{error}</Alert>}
      {verificationResult && (
        <Alert variant="filled" severity={verificationResult.valid ? "success" : "error"}>
          {verificationResult.message}
        </Alert>
      )}
    </div>
  );
};

const QRCodeScanner = () => {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <TheatreAdminLayout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#09081d]">
        {showScanner ? (
          <Scanner />
        ) : (
          <div className="flex flex-col items-center lg:py-6 lg:px-16 py-3 px-5 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Mark the E-Ticket
            </h1>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg mb-4"
              onClick={() => setShowScanner(true)}
            >
              Open Scanner
            </button>
          </div>
        )}
      </div>
    </TheatreAdminLayout>
  );
};

export default QRCodeScanner;
