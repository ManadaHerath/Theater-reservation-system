import expresss from 'express';
import {connection} from '../index.js';
import {getTheatres,addTheatre, getTheatreById} from '../controllers/theatre.js';
import { verifyAdmin, verifyUser, verifyJWT} from '../util/verify_token.js';

const router = expresss.Router();

router.get("/",verifyJWT, getTheatres);
router.post("/" , addTheatre)
router.get("/:id", getTheatreById);
export default router;