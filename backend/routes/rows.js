import expresss from 'express';
import {getRows,getSeats,addRows} from '../controllers/rows.js';


const router = expresss.Router();

router.get("/getrows/:id",getRows)
router.get("/getseats/:id",getSeats)
router.post("/addRows",addRows)

export default router;