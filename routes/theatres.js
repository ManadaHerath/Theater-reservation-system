import expresss from 'express';
import {connection} from '../index.js';

const router = expresss.Router();

router.get("/", async (req, res) => {
    try {

      const [theatres] = await connection.query('SELECT * FROM theatres');

      res.json(theatres);
    } catch (error) {
      console.error('Error fetching theatres:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

export default router;