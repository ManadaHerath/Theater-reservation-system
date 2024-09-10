import { connection } from "../index.js";

export const getPurchasedSeats = async (req, res, next) => {
  try {
    const { theatreId, showId } = req.params;
    const [purchasedSeats] = await connection.query(
      "SELECT * FROM purchases WHERE theatre_id = ? AND show_time_id = ?",
      [theatreId, showId]
    );
    const [tempPurchasedSeats] = await connection.query(
      "SELECT * FROM temp_tickets WHERE theatre_id = ? AND show_time_id = ?",
      [theatreId, showId]
    );
    const selectedSeats = [...purchasedSeats, ...tempPurchasedSeats];
    if (selectedSeats.length) {
      res.json(selectedSeats);
    } else {
      res.status(404).json({ message: "Purchased seats not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const createPurchase = async (req, res, next) => {
  try {
    const { theatre_id, show_time_id, seats, pi } = req.body;
    if (seats.length === 0) {
      return res.status(400).json({ message: "No seats selected" });
    }

    const [purchase] = await connection.query(
      "INSERT INTO temp_tickets (theatre_id, show_time_id, seats, pi) VALUES (?, ?, ?, ?)",
      [theatre_id, show_time_id, seats, pi]
    );

    res.json(purchase);
  } catch (error) {
    next(error);
  }
};

export const createPurchaseFromSession = async (purchaseData, res) => {
  try {
    const { theatre_id, show_time_id, seats, pi, token } = purchaseData.body;
    const [purchase] = await connection.query(
      "INSERT INTO purchases (theatre_id, show_time_id, seats, pi,token) VALUES (?, ?, ?, ?,?)",
      [theatre_id, show_time_id, seats, pi, token]
    );
    console.log("purchase:", purchase);
  } catch (error) {
    console.error("Error creating purchase:", error);
  }
};
