import express from 'express';
import {getSeatTypes,getSeatPrices} from '../controllers/seat_types.js';


const router = express.Router();

router.get("/types", getSeatTypes);
router.get("/prices", getSeatPrices);


export default router;