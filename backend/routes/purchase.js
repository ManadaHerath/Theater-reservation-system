import express from 'express';
import {getPurchasedSeats, createPurchase, verifyTicket} from '../controllers/purchase.js';

const route = express.Router();


route.get('/:theatreId/:showId',getPurchasedSeats);

route.post('/verify-ticket',verifyTicket);

route.post('/',createPurchase);

export default route;