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

router.get("/reviews/:id",verifyToken,getReviewsFromArticleId);
router.get("/review/:id/:rounds",verifyToken,getReviewFromReviewRounds);
router.post("/reviews",verifyToken,createReviews);
router.patch("/reviews/:id",verifyToken,updateReviews);
router.delete("/reviews/:id",verifyToken,deleteReviews);


export default router;