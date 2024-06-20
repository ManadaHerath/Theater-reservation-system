import express from 'express';
import {getPurchasedSeats} from '../controllers/purchase.js';

const route = express.Router();


route.get('/:theatreId/:showId',getPurchasedSeats);

export default route;