import { connection } from "../index.js";
export const getMovies = async (req, res,next) => {
  try {
    const [movies] = await connection.query("SELECT * FROM movies");

    res.json(movies);
  } catch (error) {
    next(error);
  }
};

export const addMovies = async (req, res, next) => {
  try {
    const {
      title,
      trailer_video_url,
      poster_url,
      overview,
      released_date,
      duration,
      original_language,
      age_type,
      is_active,
    } = req.body;

    const [result] = await connection.query(
      "INSERT INTO movies (title, trailer_video_url, poster_url, overview, released_date, duration, original_language, age_type, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        trailer_video_url,
        poster_url,
        overview,
        released_date,
        duration,
        original_language,
        age_type,
        is_active,
      ]
    );

    // Get the inserted movie ID
    const insertedId = result.insertId;

    res.json({
      id: insertedId,
      title,
      trailer_video_url,
      poster_url,
      overview,
      released_date,
      duration,
      original_language,
      age_type,
      is_active,
    });
  } catch (error) {
    console.log(error);
  }
};
