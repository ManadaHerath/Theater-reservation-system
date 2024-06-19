import expresss from 'express';
import {connection} from '../index.js';
import {postTempPurchase} from '../controllers/temp_purchase.js';

const router = expresss.Router();


router.post("/",postTempPurchase);

export default router;