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
  const [loading, setLoading] = useState(false); // Loading state
  const videoRef = useRef(null); // Reference for the video element
  const scannerRef = useRef(null); // Reference for the QRScanner instance
  const canvasRef = useRef(null); // Reference for the canvas

  // Handle the scanning logic
  const handleScan = async (result) => {
    if (result) {
      console.log("Decoded QR Code:", result.text); // Log the decoded QR code
      setScannedData(result.text);
      setIsScanning(false); // Stop scanning
      setLoading(true); // Start loading state
      await verifyScannedData(result.text); // Verify the scanned data
      setLoading(false); // End loading state
    }
  };

  // Capture image from video and decode it
  const captureImage = async () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const video = videoRef.current;

    // Set canvas dimensions to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert the canvas to a data URL
    const imageDataURL = canvas.toDataURL("image/png");

    // Use QRScanner to decode the image data URL
    try {
      const result = await QRScanner.scanImage(imageDataURL);
      handleScan(result);
    } catch (error) {
      console.error("Error scanning image:", error);
      setError("Failed to scan the QR code. Please try again.");
    }
  };

  // Verify the scanned data
  const verifyScannedData = async (dataString) => {
    try {
      const data = JSON.parse(dataString); // Assuming the scanned data is a JSON string
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
  };

  // UseEffect to start scanning
  useEffect(() => {
    if (isScanning) {
      // Initialize the QRScanner with the video element reference
      scannerRef.current = new QRScanner(videoRef.current, handleScan);
      scannerRef.current.start();

      return () => {
        scannerRef.current.stop(); // Cleanup on unmount
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
        Start Camera
      </button>

      {/* Video element for QR scanning */}
      {isScanning && (
        <>
          <video ref={videoRef} className="w-full h-80 border border-gray-400 rounded-lg mb-4" />
          <canvas ref={canvasRef} className="hidden" /> {/* Hidden canvas for capturing image */}
        </>
      )}

      {/* Button to scan the QR code */}
      {isScanning && (
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg mb-4"
          onClick={captureImage} // Capture and decode the image
        >
          Scan QR Code
        </button>
      )}

      {loading && <p className="text-yellow-600 mt-4">Scanning...</p>}

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
