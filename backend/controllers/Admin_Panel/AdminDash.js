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
