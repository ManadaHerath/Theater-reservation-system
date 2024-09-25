import { connection } from "../index.js";

export const discountCalculator = async (theatreId, showId) => {
  return new Promise((resolve, reject) => {
    // Query to get all applicable coupons for the given theatreId
    const query = `
      SELECT stripe_id FROM coupons 
      WHERE theatre_ids LIKE ? 
      AND (end_date IS NULL OR end_date > NOW())`; // Assuming you want only active coupons

    // Adjust the LIKE clause to match the theatreId
    const theatreCondition = `%${theatreId}%`; // Assuming theatre_ids is a string of comma-separated values

    connection.query(query, [theatreCondition], (error, results) => {
      if (error) {
        return reject(error);
      }

      // Extract the stripe_ids from the results
      const discounts = results.map(row => ({ coupon: row.stripe_id }));

      resolve(discounts);
    });
  });
};

