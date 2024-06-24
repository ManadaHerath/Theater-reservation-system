import nodemailer from 'nodemailer';

export const sendEmail = async (email, pdfBytes) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Movie Ticket',
    text: 'Please find your movie ticket attached.',
    attachments: [
      {
        filename: 'ticket.pdf',
        content: pdfBytes,
        contentType: 'application/pdf',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
};
