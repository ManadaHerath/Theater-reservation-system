import { connection } from "../../index.js";

export const getTheatre = async (req, res, next) => {
  const adminId = req.user;
  try {
    const [theatre] = await connection.query(
      "SELECT t.* FROM theatres t JOIN theatre_admin ta ON t.id = ta.theatre_id WHERE ta.admin_id = ?",
      [adminId]
    );

    res.json(theatre[0]);
  } catch (error) {
    next(error);
  }
};

export const updateTheatre = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      address,
      location,
      mobile_number,
      email,
      details,
      is_active,
      no_of_seats,
      no_of_rows,
      no_of_columns,
      image_url,
    } = req.body;

    const [result] = await connection.query(
      "UPDATE theatres SET name = ?, address = ?, location = ?, mobile_number = ?, email = ?, details = ?, is_active = ?, no_of_seats = ?, no_of_rows = ?, no_of_columns = ?, image_url = ? WHERE id = ?",
      [
        name,
        address,
        location,
        mobile_number,
        email,
        details,
        is_active,
        no_of_seats,
        no_of_rows,
        no_of_columns,
        image_url,
        id,
      ]
    );

    res.json({ id, ...req.body }).status(200);
    console.log("Theatre updated successfully");
  } catch (error) {
    console.log("Error updating theatre:", error);
    next(error);
  }
};

export const getMoviesByTheatre = async (req, res, next) => {
  const { id } = req.params;

  try {
    const [MoviesByTheatre] = await connection.query(
      "SELECT movie_name As label, COUNT(*) AS value FROM PurchaseDetails WHERE theatre_id = ?  AND purchased_date >= CURDATE() - INTERVAL 2 MONTH GROUP BY movie_name",
      [id]
    );

    res.json(MoviesByTheatre);
  } catch (error) {
    next(error);
  }
};
