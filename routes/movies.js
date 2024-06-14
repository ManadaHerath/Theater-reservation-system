import expresss from 'express';
import {connection} from '../index.js';
import {getMovies,addMovies} from '../controllers/movie.js';

const router = expresss.Router();

router.get("/", getMovies);
router.post("/", addMovies);

export default router;