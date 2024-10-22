import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import QRScanner from "qr-scanner"; 
import TheatreAdminLayout from "../TheatreAdminLayout";
import Alert from "@mui/material/Alert";
import axios from "../../../api/axios"; 
import jsQR from "jsqr"; 

export const Scanner = () => {
  const location = useLocation();
  const theatreId = location.state?.theatreId;
  const [scannedData, setScannedData] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  const handleScan = async (result) => {
    if (result) {
      setScannedData(JSON.parse(result.text)); // Parse scanned data directly
      verifyScannedData(result.text);
    }
  };

  const verifyScannedData = async (data) => {
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        console.log("Parsed data:", parsedData);

        const response = await axios.post("/purchased_seats/verify-ticket", {
          theatre_id: parsedData.theatre_id,
          show_time_id: parsedData.show_time_id,
          seats: parsedData.seats,
          pi: parsedData.pi,
          token: parsedData.token,
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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const image = new Image();
      image.src = imageUrl;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, image.width, image.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
          console.log("Scanned data from uploaded image:", code.data);
          setScannedData(JSON.parse(code.data));
          verifyScannedData(code.data);
        } else {
          console.error("No QR code found.");
          setError("No QR code found in the uploaded image.");
          setScannedData(null);
        }
      };
    }
  };

  const captureImageAndDecode = async () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const video = videoRef.current;

    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        console.log("Scanned data from camera:", code.data);
        setScannedData(JSON.parse(code.data));
        verifyScannedData(code.data);
      } else {
        console.error("No QR code found.");
        setError("No QR code found in the camera image.");
        setScannedData(null);
      }
    }
  };

  useEffect(() => {
    if (isScanning) {
      scannerRef.current = new QRScanner(videoRef.current, handleScan);
      scannerRef.current.start();

      return () => {
        scannerRef.current.stop();
      };
    }
  }, [isScanning]);

  const resetScanner = () => {
    setScannedData(null);
    setVerificationResult(null);
    setError(null);
    setIsScanning(false);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg mb-4"
        onClick={() => setIsScanning(true)}
      >
        Start Camera
      </button>

      {isScanning && (
        <video
          ref={videoRef}
          className="w-full h-80 border border-gray-400 rounded-lg mb-4"
        />
      )}

      {isScanning && (
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg mb-4"
          onClick={captureImageAndDecode}
        >
          Scan QR Code
        </button>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />

      {scannedData && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Scanned Details</h2>
          <p className="text-sm text-gray-700">Theatre ID: {scannedData.theatre_id}</p>
          <p className="text-sm text-gray-700">Show Time ID: {scannedData.show_time_id}</p>
          <p className="text-sm text-gray-700">Seats: {scannedData.seats}</p>
        </div>
      )}

      {error && <Alert variant="filled" severity="error">{error}</Alert>}
      {verificationResult && (
        <Alert variant="filled" severity={verificationResult.valid ? "success" : "error"}>
          {verificationResult.message}
        </Alert>
      )}

      {scannedData && (
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-3 rounded-lg mt-4"
          onClick={resetScanner}
        >
          Next User
        </button>
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
