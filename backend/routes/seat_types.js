import express from 'express';
import {getSeatTypes} from '../controllers/seat_types.js';


const router = express.Router();

router.get("/", getSeatTypes);

export default router;