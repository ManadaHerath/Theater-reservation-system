import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import TheatreAdminLayout from "../TheatreAdminLayout";

export const Scanner = () => {
  const [scannedData, setScannedData] = useState(null);

  const handleScan = (result) => {
    if (result) {
      setScannedData(result.text);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  // Increase the size of the scanner preview
  const previewStyle = {
    height: 400, 
    width: 400,  // Increased width
  };

  return (
    <div className="flex flex-col items-center p-6">
      {/* QR Scanner */}
      <QrScanner
        delay={300}
        style={previewStyle}
        onScan={handleScan}
        onError={handleError}
      />
      {scannedData && (
        <p className="text-green-600 mt-4">Scanned Data: {scannedData}</p>
      )}
    </div>
  );
};


const QRCodeScanner = () => {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <TheatreAdminLayout>
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#09081d]">
      {!showScanner ? (
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
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
          <button
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-lg"
            onClick={() => setShowScanner(true)}
          >
            Upload QR Code
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
    </div>
   </TheatreAdminLayout>
  );
};

export default QRCodeScanner;
