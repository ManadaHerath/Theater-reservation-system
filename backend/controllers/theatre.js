import { connection } from "../index.js";

export const getTheatres = async (req, res,next) => {
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
      image_url
    } = req.body;

    const [result] = await connection.query(
      "INSERT INTO theatres (name, address, location, mobile_number, email, details, is_active, no_of_seates, no_of_rows, no_of_columns, image_url) VALUES (?, ?, ST_GeomFromText(?), ?, ?, ?, ?, ?, ?, ?, ?)",
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
        image_url
      ]
    );

      const theatreIdQuery = 'SELECT id FROM theatres WHERE name = ? AND address = ? ORDER BY id DESC LIMIT 1';
      const [rows] = await connection.query(theatreIdQuery, [name, address]);
      const theatreId = rows[0]?.id;
      console.log(theatreId)



      res.json({id: theatreId, ...req.body}).status(200)
    } catch (error) {
      console.error('Error adding theatre:', error);
      next(error);
    }
  };

  export const getTheatreById = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const [theatres] = await connection.query('SELECT * FROM theatres WHERE id = ?', [id]);
  
      if (theatres.length) {
        res.json(theatres[0]);
      } else {
        res.status(404).json({ message: 'Theatre not found' });
      }
    } catch (error) {
      next(error);
    }
  };

