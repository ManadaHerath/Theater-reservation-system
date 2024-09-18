import { connection } from "../index.js";

export const getTheatres = async (req, res, next) => {
  try {
    const [movies] = await connection.query("SELECT * FROM theatres ORDER BY DATE(added_date) DESC");

    res.json(movies);
  } catch (error) {
    next(error);
  }
};

export const addTheatre = async (req, res, next) => {
  try {
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
      "INSERT INTO theatres (name, address, location, mobile_number, email, details, is_active, no_of_seats, no_of_rows, no_of_columns, image_url) VALUES (?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        address,
        null,
        mobile_number,
        email,
        details,
        is_active,
        no_of_seats,
        no_of_rows,
        no_of_columns,
        image_url,
      ]
    );

    const theatreIdQuery =
      "SELECT id FROM theatres WHERE name = ? AND address = ? ORDER BY id DESC LIMIT 1";
    const [rows] = await connection.query(theatreIdQuery, [name, address]);
    const theatreId = rows[0]?.id;

    res.json({ id: theatreId, ...req.body }).status(200);
  } catch (error) {
    console.error("Error adding theatre:", error);
    next(error);
  }
};

export const getTheatreById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [theatres] = await connection.query(
      "SELECT * FROM theatres WHERE id = ?",
      [id]
    );

    if (theatres.length) {
      res.json(theatres[0]);
    } else {
      res.status(404).json({ message: "Theatre not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteTheatre = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await connection.query(
      "DELETE FROM theatres WHERE id = ?",
      [id]
    );

    res.status(200).json({ message: "Theatre deleted successfully" });
  } catch (error) {
    console.log("Error deleting theatre:", error);
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
      "UPDATE theatres SET name = ?, address = ?, location = ST_GeomFromText(?), mobile_number = ?, email = ?, details = ?, is_active = ?, no_of_seats = ?, no_of_rows = ?, no_of_columns = ?, image_url = ? WHERE id = ?",
      [
        name,
        address,
        `POINT(${location.lat} ${location.lng})`,
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
