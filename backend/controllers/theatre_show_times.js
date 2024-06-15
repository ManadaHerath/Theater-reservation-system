import { connection } from "../index.js";

export const getShowTimes = async (req, res) => {
  const dbquery =
    "SELECT start_time,end_time,title FROM show_times INNER JOIN movies ON show_times.movie_id = movies.id where show_times.theatre_id = ?";
  try {
    const { theatre_id } = req.query;
    const [showTimes] = await connection.query(dbquery, [theatre_id]);

    res.json(showTimes);
  } catch (error) {
    next(error);
  }
};
