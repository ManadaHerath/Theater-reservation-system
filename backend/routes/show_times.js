import expresss from 'express';
import {connection} from '../index.js';
import {getAllShowTimes} from '../controllers/show_times.js';

const router = expresss.Router();

router.get("/", getAllShowTimes);

export default router;