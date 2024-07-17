import expresss from 'express';
import {connection} from '../index.js';
import {getMovies,addMovies,getMovieById} from '../controllers/movie.js';
import { verifyToken, verifyUser,verifyAdmin} from '../util/verify_token.js';


const router = expresss.Router();

router.get("/", getMovies);
router.post("/",verifyAdmin ,addMovies);
router.get("/:id", getMovieById);


export default router;