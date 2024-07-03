import { connection } from "../index.js";

export const getTheatres = async (req, res) => {
  try {
    const [movies] = await connection.query("SELECT * FROM theatres");

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
      no_of_seates,
      no_of_rows,
      no_of_columns,
    } = req.body;

    const [result] = await connection.query(
      "INSERT INTO theatres (name, address, location, mobile_number, email, details, is_active, no_of_seates, no_of_rows, no_of_columns) VALUES (?, ?, ST_GeomFromText(?), ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        address,
        `POINT(${location.lat} ${location.lng})`,
        mobile_number,
        email,
        details,
        is_active,
        no_of_seates,
        no_of_rows,
        no_of_columns,
      ]
    );
    res.json({ id: result.insertId, ...req.body });
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
