import express from 'express';
import {getPurchasedSeats, createPurchase} from '../controllers/purchase.js';

const route = express.Router();


route.get('/:theatreId/:showId',getPurchasedSeats);

route.post('/',createPurchase);

export default route;