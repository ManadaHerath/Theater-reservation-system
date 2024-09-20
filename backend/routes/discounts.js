import express from 'express';
import { createCoupon } from '../controllers/discounts.js';


const router = express.Router();

router.post('/create-coupon', createCoupon);

export default router;