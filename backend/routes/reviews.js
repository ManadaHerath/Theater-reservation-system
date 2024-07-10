import express from 'express';
import {getReviews,getUserRating,PostReviewReply,updateReviewLikes,addReview,addRating} from '../controllers/reviews.js';
import { getIDFromToken } from '../middlewares/getIDFromToken.js';

const router = express.Router();

router.get("/:id",getReviews)
router.get("/rating/:id",getIDFromToken,getUserRating)
router.post("/reply",getIDFromToken,PostReviewReply)
router.patch("/like",updateReviewLikes)
router.post("/addReview",getIDFromToken,addReview)
router.post("/addRating",getIDFromToken,addRating)

export default router;