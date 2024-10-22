import { PDFDocument, rgb } from 'pdf-lib';
import { connection } from '../../index.js'; // Reuse the existing MySQL connection

// Fetch ticket details from the database
const fetchTicketDetails = async (show_time_id, theatre_id) => {
  try {
    const [rows] = await connection.query(
      `SELECT st.movie_id, st.start_time, st.end_time, 
              m.title AS movie_name, t.name AS theatre_name 
       FROM show_times st
       JOIN movies m ON st.movie_id = m.id
       JOIN theatres t ON st.theatre_id = t.id
       WHERE st.id = ? AND t.id = ?`,
      [show_time_id, theatre_id]

    );

    if (rows.length === 0) {
      throw new Error('No ticket details found for the given show time and theatre.');
    }

    return rows[0]; // Return the first matching result
  } catch (error) {
    console.error('Error fetching ticket details:', error);
    throw error;
  }
};

// Generate the PDF with the fetched data
export const createPDF = async (data, qrCodeDataUrl) => {
  try {
    const { show_time_id, theatre_id, seats } = data;

    // Fetch movie, theatre, and showtime details
    const ticketDetails = await fetchTicketDetails(show_time_id, theatre_id);
    const { movie_name, theatre_name, start_time, end_time } = ticketDetails;

    // Create a new PDF document with portrait layout (400x600)
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 600]);

    // Embed the QR code image
    const qrImage = await pdfDoc.embedPng(
      await fetch(qrCodeDataUrl).then((res) => res.arrayBuffer())
    );

    // Draw the QR code at the top center of the page
    page.drawImage(qrImage, {
      x: 125,
      y: 450,
      width: 150,
      height: 150,
    });

    // Add the movie name
    page.drawText(movie_name, {
      x: 50,
      y: 400,
      size: 24,
      color: rgb(0, 0, 0),
    });

    // Add the theatre name
    page.drawText(`Theatre: ${theatre_name}`, {
      x: 50,
      y: 350,
      size: 18,
      color: rgb(0, 0, 0),
    });

    // Add the showtime start and end times
    page.drawText(`Start: ${new Date(start_time).toLocaleString()}`, {
      x: 50,
      y: 320,
      size: 16,
      color: rgb(0, 0, 0),
    });
    page.drawText(`End: ${new Date(end_time).toLocaleString()}`, {
      x: 50,
      y: 290,
      size: 16,
      color: rgb(0, 0, 0),
    });

    // Add the seats information
    page.drawText(`Seats: ${seats}`, {
      x: 50,
      y: 260,
      size: 16,
      color: rgb(0, 0, 0),
    });

    // Save the PDF to a buffer and return it
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;

  } catch (error) {
    console.error('Error creating PDF:', error);
    throw error;
  }
};
