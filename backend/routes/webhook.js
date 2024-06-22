import express from 'express';
import Stripe from 'stripe';
import 'dotenv/config';
import { createPurchaseFromSession } from '../controllers/purchase.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

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

    const theatreId = session.metadata?.theatreId;
    const showId = session.metadata?.showId;
    const seatInfo = session.metadata?.selectedSeats;

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

    

    // Now safely map over seatInfo
    const seats = (JSON.parse(seatInfo)).map(seat => seat.seat_label).join(',');


    const reqForCreatePurchase = {
      body:{
        theatre_id: theatreId,
        show_time_id: showId,
        seats: seats,
      },
    };
    console.log('reqForCreatePurchase:', reqForCreatePurchase);

    try {
      await createPurchaseFromSession(reqForCreatePurchase);
    } catch (error) {
      console.error('Error creating purchase:', error);
      return res.sendStatus(500); // Send a response on error
    }
  }

  res.status(200).json({ received: true });
});

export default router;
