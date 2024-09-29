import expresss from 'express';
import {connection} from '../index.js';
import {getAllShowTimes, getShowTimesByTheatre, deleteShowTime,addShowTime} from '../controllers/show_times.js';

const router = expresss.Router();

router.get("/", getAllShowTimes);
router.get("/theatre/:theatreId", getShowTimesByTheatre);
router.post("/", addShowTime);
router.delete("/:id", deleteShowTime);

export default router;