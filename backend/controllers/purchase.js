import { connection } from "../index.js";

export const getPurchasedSeats = async (req, res, next) => {
  try {
    const { theatreId, showId } = req.params;
    const [purchasedSeats] = await connection.query(
      "SELECT * FROM purchases WHERE theatre_id = ? AND show_time_id = ?",
      [theatreId, showId]
    );
    const [tempPurchasedSeats] = await connection.query(
      "SELECT * FROM temp_purchases WHERE theatre_id = ? AND show_time_id = ?",
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

export const verifyTicket = async (req, res) => {
  const { theatre_id, show_time_id, seats, pi, token } = req.body;

  console.log("req.body:", req.body);

  try {

    // SQL query to find the ticket
    const [rows] = await connection.query(
      'SELECT * FROM purchases WHERE pi = ? AND token = ?',
      [pi, token]
    );

    // Check if the purchase exists
    if (rows.length === 0) {
      return res.status(404).json({ valid: false, message: "Ticket not found." });
    }

    // Destructure the purchase details from the retrieved row
    const purchase = rows[0];

    // Validate the other fields
    if (
      purchase.theatre_id !== theatre_id ||
      purchase.show_time_id !== show_time_id ||
      purchase.seats !== seats
    ) {
      return res.status(400).json({ valid: false, message: "Ticket details do not match." });
    }

    // If ticket is valid
    return res.json({ valid: true, message: "Ticket is valid.", purchase });
  } catch (error) {
    console.error("Error verifying ticket:", error);
    return res.status(500).json({ valid: false, message: "Internal server error." });
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
    const { theatre_id, show_time_id, seats, pi, token, price, discount } = purchaseData.body;
    console.log("purchaseData:", purchaseData.body);
    const [purchase] = await connection.query(
      "INSERT INTO purchases (theatre_id, show_time_id, seats, pi,token, price, discount) VALUES (?, ?, ?, ?,?,?,?)",
      [theatre_id, show_time_id, seats, pi, token, price, discount]
    );
    console.log("purchase:", purchase);
  } catch (error) {
    console.error("Error creating purchase:", error);
  }
};
