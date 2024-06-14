import expresss from 'express';
import {connection} from '../index.js';
import {getTheatres,addTheatre} from '../controllers/theatre.js';

const router = expresss.Router();

router.get("/", getTheatres);
router.post("/", addTheatre)

export default router;