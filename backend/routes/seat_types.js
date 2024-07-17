import express from 'express';
import {getSeatTypes,getSeatPrices,addSeatType,addPriceType, getPricesByTheatre, deletePriceCategory} from '../controllers/seat_types.js';


const router = express.Router();

router.get("/types", getSeatTypes);
router.post("/types",addSeatType);
router.get("/prices", getSeatPrices);
router.post("/prices",addPriceType);
router.delete("/prices",deletePriceCategory);
router.get("/pricesByTheatre/:theatreId",getPricesByTheatre)


export default router;