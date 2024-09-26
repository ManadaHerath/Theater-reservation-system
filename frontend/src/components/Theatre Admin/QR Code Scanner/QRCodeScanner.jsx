import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRCodeScanner = () => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      (decodedText, decodedResult) => {
        console.log(`Code scanned = ${decodedText}`, decodedResult);
      },
      (errorMessage) => {
        console.log(`Error scanning = ${errorMessage}`);
      }
    );

    return () => {
      scanner.clear().catch((error) => {
        console.error('Failed to clear scanner:', error);
      });
    };
  }, []);

  return <div id="reader" className='text-white' style={{ width: '500px' }}></div>;
};

export default QRCodeScanner;
