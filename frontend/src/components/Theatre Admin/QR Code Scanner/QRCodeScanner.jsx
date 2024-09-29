import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import QrScanner from "react-qr-scanner";

const QRCodeScanner = () => {
  const [text, setText] = useState("");
  const [scannedData, setScannedData] = useState(null);

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleScan = (result) => {
    if (result) {
      setScannedData(result.text);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <div className="flex flex-col items-center p-6">
      {/* QR Code Generator */}
      <h2 className="text-xl font-semibold mb-4 text-white">QR Code Generator</h2>
      <input
        type="text"
        value={text}
        onChange={handleInputChange}
        placeholder="Enter text to generate QR Code"
        className="p-2 border rounded mb-4 w-72"
      />
      <QRCodeCanvas value={text || " "} size={200} className="mb-8" />

      <h2 className="text-xl font-semibold mb-4 text-white">QR Code Scanner</h2>
      <QrScanner
        delay={300}
        style={previewStyle}
        onScan={handleScan}
        onError={handleError}
      />
      {scannedData && (
        <p className="text-green-600">Scanned Data: {scannedData}</p>
      )}
    </div>
  );
};

export default QRCodeScanner;
