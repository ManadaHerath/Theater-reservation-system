import { connection } from "../index.js";
export const getMovies = async (req, res, next) => {
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

export const getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbquery =
      "SELECT movies.id,movies.title,movies.trailer_video_url,movies.cover_photo,movies.overview,movies.released_date,movies.duration,movies.original_language,movies.age_type,movies.movie_director,movies.rating,movies.movie_writter,JSON_ARRAYAGG(JSON_OBJECT('name', actors.full_name, 'avatar', actors.avatar)) AS actors FROM movies LEFT JOIN actors ON movies.id = actors.movie_id WHERE movies.id = ? GROUP BY movies.id";
    const [movie] = await connection.query(dbquery, [id]);

    res.json(movie[0]);
  } catch (error) {
    next(error);
  }
};
