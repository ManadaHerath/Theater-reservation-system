import { connection } from "../index.js";
import Stripe from 'stripe';

export const createCoupon = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const { duration, id, percent_off } = req.body; // Get coupon details from the request body
    console.log("yee",duration,id,percent_off)
    const coupon = await stripe.coupons.create({
      duration: duration || 'once',
      id: id || '',
      percent_off: percent_off || 0, // Default to 100% if not provided
    });

    res.status(200).json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


