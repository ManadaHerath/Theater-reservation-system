import QRCode from 'qrcode';

export const generateQRCode = async (data) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data);
    return qrCodeDataUrl;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw err;
  }
};
