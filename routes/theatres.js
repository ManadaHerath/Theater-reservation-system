import expresss from 'express';
import {connection} from '../index.js';
import {getTheatres} from '../controllers/theatre.js';

const router = expresss.Router();

router.get("/", getTheatres);

export default router;