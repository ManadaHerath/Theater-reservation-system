import expresss from 'express';
import {connection} from '../index.js';
import {getTheatres,addTheatre} from '../controllers/theatre.js';
import { verifyToken, verifyUser,verifyAdmin} from '../util/verify_token.js';

const router = expresss.Router();

router.get("/", getTheatres);
router.post("/",verifyAdmin , addTheatre)

export default router;