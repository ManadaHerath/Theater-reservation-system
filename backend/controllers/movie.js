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
  const movie = req.body.movie;
  const actors = req.body.actors;
  try {
    const [result] = await connection.query(
      "INSERT INTO movies (title, trailer_video_url, poster_url, overview, released_date, duration, original_language,movie_director,movie_writter,cover_photo,rating ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        movie.title,
        movie.trailer_video_url,
        movie.poster_url,
        movie.overview,
        movie.released_date,
        movie.duration,
        movie.original_language,
        movie.movie_director,
        movie.movie_writer,
        movie.cover_photo,
        movie.rating,
      ]
    );

    const movieId = await connection.query(
      "SELECT id FROM movies WHERE title = ?",
      [movie.title]
    );

    const newMovieId = movieId[0][0].id;

    for (const actor of actors) {
      await connection.query(
        "INSERT INTO actors (full_name, avatar, movie_id) VALUES (?, ?, ?)",
        [actor.name, actor.photo_url,newMovieId]
      );
    }
    
    res.status(201).json({ message: "Movie added successfully" });
    
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

export const updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
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
      "UPDATE movies SET title = ?, trailer_video_url = ?, poster_url = ?, overview = ?, released_date = ?, duration = ?, original_language = ?, age_type = ?, is_active = ? WHERE id = ?",
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
        id,
      ]
    );

    res.json({
      id,
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
    next(error);
  }
};

export const deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Deleting movie with id: ", id);
    await connection.query("DELETE FROM movies WHERE id = ?", [id]);
    console.log("Movie deleted");
    res.json({ message: "Movie deleted" });
  } catch (error) {
    next(error);
  }
};
