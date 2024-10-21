import React, { useState, useEffect, useRef } from "react";
import QRScanner from "qr-scanner"; // Ensure QRScanner can access the camera
import TheatreAdminLayout from "../TheatreAdminLayout";
import Alert from "@mui/material/Alert";
import axios from "../../../api/axios"; // Make sure to install axios
import jsQR from "jsqr"; // Import jsQR

// Scanner component for QR code scanning
export const Scanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null); // Reference for the video element
  const scannerRef = useRef(null); // Reference for the QRScanner instance

  // Handle the scanning logic
  const handleScan = async (result) => {
    if (result) {
      setScannedData(result.text);
      verifyScannedData(result.text);
    }
  };

  // Verify the scanned data
  const verifyScannedData = async (data) => {
    if (data) {
      try {
        const parsedData = JSON.parse(data); // Assuming the scanned data is a JSON string
        console.log("Parsed data:", parsedData);
        const response = await axios.post('/purchased_seats/verify-ticket', {
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

  // Handle image upload and QR code decoding
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a URL for the uploaded image
      const image = new Image();
      image.src = imageUrl;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, image.width, image.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height); // Use jsQR to decode

        if (code) {
          console.log("Scanned data from uploaded image:", code.data);
          setScannedData(code.data);
          verifyScannedData(code.data); // Optionally verify the scanned data
        } else {
          console.error("No QR code found.");
          setError("No QR code found in the uploaded image.");
          setScannedData(null);
        }
      };
    }
  };

  // Capture image from video feed and decode it
  const captureImageAndDecode = async () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const video = videoRef.current;

    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data and decode QR code using jsQR
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        console.log("Scanned data from camera:", code.data);
        setScannedData(code.data);
        verifyScannedData(code.data); // Optionally verify the scanned data
      } else {
        console.error("No QR code found.");
        setError("No QR code found in the camera image.");
        setScannedData(null);
      }
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
        <video ref={videoRef} className="w-full h-80 border border-gray-400 rounded-lg mb-4" />
      )}

      {/* Button to scan the QR code */}
      {isScanning && (
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg mb-4"
          onClick={captureImageAndDecode} // Capture image and decode
        >
          Scan QR Code
        </button>
      )}

      {/* Upload input for QR code image */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />

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
