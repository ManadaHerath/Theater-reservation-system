import expresss from 'express';
import {getRows,getSeats} from '../controllers/rows.js';


const router = expresss.Router();

router.get("/getrows/:id",getRows)
router.get("/getseats/:id",getSeats)

export default router;