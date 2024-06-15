import expresss from 'express';
import {connection} from '../index.js';
import {getShowTimes} from '../controllers/theatre_show_times.js';

const router = expresss.Router();

router.get("/", getShowTimes);

export default router;