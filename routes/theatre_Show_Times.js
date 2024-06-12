import expresss from 'express';
import {connection} from '../index.js';

const router = expresss.Router();

//when gives theatre_id as query parameter, it returns the movie title and showtimes of that theatre
router.get("/", async (req, res) => {
    try {
        const { theatre_id } = req.query;
      const [showTimes] = await connection.query('SELECT start_time,end_time,title FROM show_times INNER JOIN movies ON show_times.movie_id = movies.id where show_times.theatre_id = ?',[theatre_id]);

      res.json(showTimes);
    } catch (error) {
      console.error('Error fetching showtimes:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

export default router;