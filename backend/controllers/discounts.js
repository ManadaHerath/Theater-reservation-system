import { connection } from "../index.js";
import Stripe from 'stripe';

export const createCoupon = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  try {
    const { duration, id, percent_off, type, end_date, theatre_ids, movie_ids } = req.body; // Get coupon details from the request body
    console.log("Received coupon data:", duration, id, percent_off, type, end_date, theatre_ids, movie_ids);
    
    // Create the coupon in Stripe
    const coupon = await stripe.coupons.create({
      duration: duration || 'once',
      id: id || '',
      percent_off: percent_off || 0, // Default to 0% if not provided
    });

    // Store the coupon data in the MySQL database
    const query = `
      INSERT INTO coupons (stripe_id, duration, percent_off, type, end_date, theatre_ids, movie_ids)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      coupon.id, // Stripe coupon ID
      duration,
      percent_off,
      type,
      end_date ? new Date(end_date) : null, // Ensure end_date is in correct format
      theatre_ids.join(','), // Convert array to string if needed
      movie_ids.join(',') // Convert array to string if needed
    ];



    const [result] = await connection.query(query, values);

    if (result.affectedRows === 1) {
      console.log('Coupon created successfully:', coupon);
      res.status(200).json({ success: true});
    }

  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getCoupons = async () =>{
  try{
    const [coupons] = await connection.query('SELECT * FROM coupons');
    return coupons;
  }catch(error){
    return {error: error.message};
  }
}