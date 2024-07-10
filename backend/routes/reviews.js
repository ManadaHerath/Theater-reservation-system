import express from 'express';
import {getReviews,PostReviewReply,updateReviewLikes,addReview} from '../controllers/reviews.js';
import { getIDFromToken } from '../middlewares/getIDFromToken.js';

const router = express.Router();

router.get("/:id",getReviews)
router.post("/reply",getIDFromToken,PostReviewReply)
router.patch("/like",updateReviewLikes)
router.post("/addReview",getIDFromToken,addReview)

export default router;