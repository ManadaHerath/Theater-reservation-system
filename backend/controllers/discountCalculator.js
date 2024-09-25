import { connection } from "../index.js";

export const discountCalculator = async (theatreId, showId) => {
  try {
    console.log(theatreId, "Calculating discounts");

    // Query to get all coupons for the given theatreId OR where theatre_ids is empty
    const query = `
      SELECT stripe_id, percent_off FROM coupons 
      WHERE (theatre_ids LIKE ? OR theatre_ids = '' OR theatre_ids IS NULL)
      AND (end_date IS NULL OR end_date > NOW())`; // Only active coupons

    // Adjust the LIKE clause to match the theatreId
    const theatreCondition = `%${theatreId}%`; // Assuming theatre_ids is a string of comma-separated values

    // Use connection.execute to fetch the results
    const [results] = await connection.execute(query, [theatreCondition]);

    // If no coupons found, return an empty array
    if (results.length === 0) {
      return [];
    }

    // Find the coupon with the highest percent_off
    const maxDiscountCoupon = results.reduce((maxCoupon, currentCoupon) => {
      return currentCoupon.percent_off > maxCoupon.percent_off ? currentCoupon : maxCoupon;
    }, results[0]);

    // Return the coupon with the max percent_off
    return [{ coupon: maxDiscountCoupon.stripe_id }];
  } catch (error) {
    console.error("Error fetching discounts:", error);
    return [];
  }
};
