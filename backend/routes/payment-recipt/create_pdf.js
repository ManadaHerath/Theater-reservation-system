import { PDFDocument, rgb } from 'pdf-lib';

export const createPDF = async (data, qrCodeDataUrl) => {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add a page to the document
    const page = pdfDoc.addPage([600, 400]);

    // Add text and other elements to the page
    page.drawText('Movie Ticket', { x: 50, y: 350, size: 30, color: rgb(0, 0, 0) });
    page.drawText(`Theatre ID: ${data.theatre_id}`, { x: 50, y: 300, size: 20, color: rgb(0, 0, 0) });
    page.drawText(`Show Time ID: ${data.show_time_id}`, { x: 50, y: 250, size: 20, color: rgb(0, 0, 0) });
    page.drawText(`Seats: ${data.seats}`, { x: 50, y: 200, size: 20, color: rgb(0, 0, 0) });

    // Embed QR code image
    const qrImage = await pdfDoc.embedPng(await fetch(qrCodeDataUrl).then(res => res.arrayBuffer()));
    page.drawImage(qrImage, {
      x: 400,
      y: 150,
      width: 150,
      height: 150,
    });

    // Save the PDF document to a buffer
    const pdfBytes = await pdfDoc.save();
    
    return pdfBytes;

  } catch (error) {
    console.error('Error creating PDF:', error);
    throw error;
  }
};
