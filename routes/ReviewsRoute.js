import express from "express";
import {
    getReviewsFromArticleId,
    getReviewFromReviewRounds,
    createReviews,
    updateReviews,
    deleteReviews
} from "../controllers/ReviewsController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/reviews/:id",getReviewsFromArticleId);
router.get("/review/:id/:rounds",getReviewFromReviewRounds);
router.post("/reviews",createReviews);
router.patch("/reviews/:id",updateReviews);
router.delete("/reviews/:id",deleteReviews);


export default router;