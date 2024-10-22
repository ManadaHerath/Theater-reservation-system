
import express from 'express';
import Stripe from 'stripe';
import 'dotenv/config';
import {discountCalculator} from '../controllers/discountCalculator.js';
import { connection } from '../index.js';

const getSeatDetails = async (theatreId, selectedSeats) => {
  try {
    // Query the theater_grids table to get grid and seat_types for the given theatreId
    const query = `
      SELECT grid, seat_types FROM theater_grids WHERE theatre_id = ?`;

    const [theatreGrid] = await connection.query(query, [theatreId]);

    // Check if the result has rows
    if (!theatreGrid || theatreGrid.length === 0) {
      throw new Error("Theatre not found or no grid data available");
    }

    // Access the first row from the query result
    const { grid, seat_types } = theatreGrid[0];

    // Since the data is in JSON format, you can access it directly
    const parsedGrid = grid;           // Access grid JSON
    const parsedSeatTypes = seat_types; // Access seat_types JSON

    // Helper function to get seat type and price based on the seat's row
    const getSeatTypeAndPrice = (seatLabel) => {
      for (let rowIndex = 0; rowIndex < parsedGrid.length; rowIndex++) {
        const row = parsedGrid[rowIndex];
        const seat = row.find((s) => s.name === seatLabel);

        if (seat) {
          const seatType = parsedSeatTypes[rowIndex]; // The seat type corresponds to the row index
          return {
            seat_type: seatType.type,
            price: seatType.price,
            childrenPrice: seatType.childrenprice // Include children price
          };
        }
      }
      return null; // If the seat is not found
    };

    // Map through selectedSeats to create the detailed object
    const seatDetails = selectedSeats.map((seat) => {
      const seatTypeInfo = getSeatTypeAndPrice(seat.seat_label);

      if (!seatTypeInfo) {
        throw new Error(`Seat ${seat.seat_label} not found in grid.`);
      }

      const price =
        seat.price_type === "child" && seatTypeInfo.childrenPrice !== undefined
          ? seatTypeInfo.childrenPrice
          : seatTypeInfo.price; // Use child price if applicable

      return {
        seat_label: seat.seat_label,
        seat_type: `${seatTypeInfo.seat_type} - ${seat.price_type.charAt(0).toUpperCase() + seat.price_type.slice(1)}`,
        price: price,
      };
    });

    return seatDetails; // Return the seat details for use in another function

  } catch (error) {
    console.error("Error getting seat details:", error.message);
    throw error; // Rethrow the error for the calling function to handle
  }
};


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  const { selectedSeats, seatTypeCounts, totalPrice, theatreId, showId } =
    req.body;

  console.log(req.body)
  const seats =await getSeatDetails(theatreId,selectedSeats);
  console.log(seats)
  const line_items = seats.map(seat => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: seat.seat_label+" - "+seat.seat_type,

      },
      unit_amount: Math.round(seat.price * 100),
    },
    quantity: 1,
  }));
  const calculatedTotalPrice = line_items.reduce((sum, item) => sum + item.price_data.unit_amount / 100, 0);
  
  
  const discounts = await discountCalculator(theatreId, showId);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      discounts: discounts,
      success_url: `https://theater-reservation-system-ebon.vercel.app/payment-success`,
      cancel_url: `https://theater-reservation-system-ebon.vercel.app/payment-failure/${showId}/${theatreId}`,
      metadata: {
        theatreId,
        showId,
        total_price: calculatedTotalPrice,
        discount: discounts[0]?.coupon,
        selectedSeats: JSON.stringify(selectedSeats),
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).json({ error: "Failed to create Stripe checkout session" });
  }
});

export default router;
