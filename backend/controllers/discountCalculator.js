import { connection } from "../index.js";

export const discountCalculator = async (theatreId, showId) => {
  try {
    console.log(theatreId,"yo discount")
    // Query to get all applicable coupons for the given theatreId
    const query = `
      SELECT stripe_id FROM coupons 
      WHERE theatre_ids LIKE ? 
      AND (end_date IS NULL OR end_date > NOW())`; // Assuming you want only active coupons

    // Adjust the LIKE clause to match the theatreId
    const theatreCondition = `%${theatreId}%`; // Assuming theatre_ids is a string of comma-separated values

    // Use a promise-based method to get the results from the connection
    const [results] = await connection.execute(query, [theatreCondition]);
    if (results.length > 0) {
        return [{ coupon: results[0].stripe_id }]; // Return the first discount
      }
    // Map the results to the desired format for Stripe discounts
    return [];
  } catch (error) {
    console.error("Error fetching discounts:", error);
  }
};
