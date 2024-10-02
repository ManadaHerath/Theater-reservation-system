import React, { useState } from "react";
import QRScanner from "qr-scanner";
import TheatreAdminLayout from "../TheatreAdminLayout";
import Alert from "@mui/material/Alert";

export const Scanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = (result) => {
    if (result) {
      setScannedData(result.text);
    }
  };

  const handleError = (error) => {
    setError(error);
  };

  // Increase the size of the scanner preview
  const previewStyle = {
    height: 400,
    width: 400, // Increased width
  };

  return (
    <div className="flex flex-col items-center p-6">
      {/* QR Scanner */}
      <QRScanner
        delay={300}
        style={previewStyle}
        onScan={handleScan}
        onError={handleError}
      />
      {scannedData && (
        <p className="text-green-600 mt-4">Scanned Data: {scannedData}</p>
      )}

      {error && <Alert variant="filled" severity="warning"> Error While Scanning QR Code </Alert>}
    </div>
  );
};

const QRCodeScanner = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);

  // Function to handle QR code upload and extract data
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const result = await QRScanner.scanImage(file, { returnDetailedScanResult: true });
        setScannedData(result.data);
      } catch (error) {
        setError(error);
      }
    }
  };

  return (
    <TheatreAdminLayout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#09081d]">
        {!showScanner ? (
          <div className="flex flex-col items-center lg:py-6 lg:px-16 py-3 px-5 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Mark the E-Ticket
            </h1>
            {/* Sample QR Code */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
              alt="Sample QR Code"
              className="w-48 h-48 mb-6"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg mb-4"
              onClick={() => setShowScanner(true)}
            >
              Open Scanner
            </button>
            <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-lg">
              <label htmlFor="qr-upload" className="cursor-pointer">
                Upload QR Code
              </label>
              <input
                id="qr-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </button>
          </div>
        ) : (
          <div className="relative w-96 h-96 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Scanning...
            </h2>
            {/* QR Scanner */}
            <div className="relative w-full h-full bg-gray-200 overflow-hidden">
              <Scanner />
            </div>
            <button
              className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold px-4 py-2 rounded mx-auto block"
              onClick={() => setShowScanner(false)}
            >
              Close Scanner
            </button>
          </div>
        )}
        {scannedData && (
          <p className="text-green-600 mt-4">Scanned Data: {scannedData}</p>
        )}

        {error && <Alert variant="filled" severity="warning">
        Error While Scanning QR Code
      </Alert>}
      </div>
    </TheatreAdminLayout>
  );
};

export default QRCodeScanner;
