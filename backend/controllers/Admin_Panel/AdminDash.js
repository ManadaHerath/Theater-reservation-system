import { connection } from "../../index.js";

export const getRegistrations = async (req, res, next) => {
  try {
    const [registrations] = await connection.query(
      "SELECT DATE(registered_date) AS registered_date, COUNT(*) AS registration_count FROM users GROUP BY DATE(registered_date) ORDER BY DATE(registered_date) ASC"
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
      "SELECT DATE(purchased_date) AS purchased_date, COUNT(*) AS purchased_count FROM purchases GROUP BY DATE(purchased_date) ORDER BY DATE(purchased_date) ASC"
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
