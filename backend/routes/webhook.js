import express from 'express';
import Stripe from 'stripe';
import 'dotenv/config';
import { createPurchaseFromSession } from '../controllers/purchase.js';
import {generateQRCode} from '../routes/payment-recipt/qrcodegen.js';
import { createPDF } from './payment-recipt/create_pdf.js';
import fs from 'fs';
import path from 'path';
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
    const pi = session.payment_intent;
    const theatreId = session.metadata?.theatreId;
    const showId = session.metadata?.showId;
    const seatInfo = session.metadata?.selectedSeats;
    const customerEmail = session.customer_details.email;

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
      },
    };

    try {
      await createPurchaseFromSession(reqForCreatePurchase);

      const qrCodeDataUrl = await generateQRCode(JSON.stringify(reqForCreatePurchase.body));


      const pdfBytes = await createPDF(reqForCreatePurchase.body, qrCodeDataUrl);
      
      await sendEmailWithAttachment(customerEmail, pdfBytes);

    } catch (error) {
      console.error(error);
      return res.sendStatus(500); 
    }
  }

  res.status(200).json({ received: true });
});

const sendEmailWithAttachment = async (toEmail, pdfBytes) => {
  try {
    // Send email using nodemailer
    const info = await transporter.sendMail({
      from: `"Your Application" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Your Ticket PDF',
      text: 'Please find attached your ticket PDF.',
      attachments: [{
        filename: 'ticket.pdf',
        content: pdfBytes,
        encoding: 'base64', // PDF content encoding
      }],
    });

    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default router;
