import expresss from 'express';
import {connection} from '../index.js';

const router = expresss.Router();

router.get("/", async (req, res) => {
    try {

      const [movies] = await connection.query('SELECT * FROM movies');

      res.json(movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

export default router;