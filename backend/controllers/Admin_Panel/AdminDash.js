import { connection } from "../../index.js";

export const getRegistrations = async (req, res, next) => {
  try {
    const [registrations] = await connection.query(
      "SELECT DATE(registered_date) AS registered_date, COUNT(*) AS registration_count FROM users WHERE registered_date >= CURDATE() - INTERVAL 14 DAY GROUP BY DATE(registered_date) ORDER BY DATE(registered_date) ASC"
    );

    const formattedRegistrations = registrations.map((reg) => {
      const date = new Date(reg.registered_date);
      date.setDate(date.getDate() + 1);
      const adjustedDate = date.toISOString().split("T")[0];
      return {
        registered_date: adjustedDate,
        registration_count: reg.registration_count,
      };
    });

    res.json(formattedRegistrations);
  } catch (error) {
    next(error);
  }
};

export const getPurchasedTickets = async (req, res, next) => {
  try {
    const [purchased_tickets] = await connection.query(
      "SELECT DATE(purchased_date) AS purchased_date, COUNT(*) AS purchased_count FROM purchases WHERE purchased_date >= CURDATE() - INTERVAL 14 DAY GROUP BY DATE(purchased_date)ORDER BY DATE(purchased_date) ASC"
    );

    const formattedpurchased_tickets = purchased_tickets.map((purchased) => {
      const date = new Date(purchased.purchased_date);
      date.setDate(date.getDate() + 1);
      const adjustedDate = date.toISOString().split("T")[0];
      return {
        purchased_date: adjustedDate,
        purchased_count: purchased.purchased_count,
      };
    });

    res.json(formattedpurchased_tickets);
  } catch (error) {
    next(error);
  }
};

export const getTicketsByTheatre = async (req, res, next) => {
  try {
    const [ticketsByTheatre] = await connection.query(
      "SELECT CONCAT(theatre_name, ' - ', theatre_district) As label, COUNT(*) AS value FROM PurchaseDetails WHERE purchased_date >= CURDATE() - INTERVAL 2 MONTH GROUP BY theatre_name,theatre_district"
    );

    res.json(ticketsByTheatre);
  } catch (error) {
    next(error);
  }
};

export const getTicketsByMovie = async (req, res, next) => {
  try {
    const [ticketsByMovie] = await connection.query(
      "SELECT movie_name As label, COUNT(*) AS value FROM PurchaseDetails WHERE purchased_date >= CURDATE() - INTERVAL 2 MONTH GROUP BY movie_name"
    );

    res.json(ticketsByMovie);
  } catch (error) {
    next(error);
  }
};
