import express from 'express';
import Stripe from 'stripe';
import 'dotenv/config';
import { createPurchaseFromSession } from '../controllers/purchase.js';
import {generateQRCode} from '../routes/payment-recipt/qrcodegen.js';
import { createPDF } from './payment-recipt/create_pdf.js';
import { tokenGen } from './tokenGen.js';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Error verifying Stripe webhook signature:', err);
    return res.sendStatus(400);
  }

  if (event.type === 'checkout.session.completed') {

    const session = event.data.object;
    console.log("Emaillllll",session.email)
    const pi = session.payment_intent;
    const theatreId = session.metadata?.theatreId;
    const showId = session.metadata?.showId;
    const seatInfo = session.metadata?.selectedSeats;
    const customerEmail = session.customer_details.email;
    const token = tokenGen();

    if (!theatreId || !showId) {
      console.error('Missing metadata in session');
      return res.sendStatus(400);
    }
    let lineItems;

    try {
      const retrievedSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items']
      });
      lineItems = retrievedSession.line_items.data;
    } catch (err) {
      console.error('Error fetching line items:', err);
      return res.sendStatus(500);
    }

    


    const seats = (JSON.parse(seatInfo)).map(seat => seat.seat_label).join(',');


    const reqForCreatePurchase = {
      body:{
        theatre_id: theatreId,
        show_time_id: showId,
        seats: seats,
        pi: pi,
        token: token,

      },
    };

    try {
      await createPurchaseFromSession(reqForCreatePurchase);

      const qrCodeDataUrl = await generateQRCode(JSON.stringify(reqForCreatePurchase.body));


      const pdfBytes = await createPDF(reqForCreatePurchase.body, qrCodeDataUrl);
      
      await sendEmailWithAttachment(customerEmail, pdfBytes,`http://localhost:3000/refund/${token}`);

    } catch (error) {
      console.error(error);
      return res.sendStatus(500); 
    }
  }

  res.status(200).json({ received: true });
});

const sendEmailWithAttachment = async (toEmail, pdfBytes, refundLink) => {
  try {
    const info = await transporter.sendMail({
      from: `"Movie Mingle" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Your Ticket',
      html: `
        <p>Thank you for your purchase!</p>
        <p>Please find attached your ticket PDF.</p>
        <p>If you need to request a refund or cancel your purchase, click the link below:</p>
        <p><a href="${refundLink}">Refund or Cancel Purchase</a></p>
      `,
      attachments: [{
        filename: 'ticket.pdf',
        content: pdfBytes,
        encoding: 'base64', // PDF content encoding
      }],
    });

    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Re-throw the error to handle it outside this function
  }
};


export default router;
