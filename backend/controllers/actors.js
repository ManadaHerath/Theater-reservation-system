import { connection } from "../index.js";

export const addActors = async (req, res, next) => {
  try {
    const { actors, movie_id } = req.body;

    for (const actor of actors) {
      await connection.query(
        "INSERT INTO actors (full_name, avatar, movie_id) VALUES (?, ?, ?)",
        [actor.name, actor.photo_url, movie_id]
      );
    }

  
  } catch (error) {
    next(error);
  }
};
