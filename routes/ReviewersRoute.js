import express from "express";
import {
    getReviewersFromUser,
    getReviewersFromReviewsId,
    getReviewersFromUserReviewers,
    getReviewersFromReviewersId,
    addReviewers,
    writeReviews,
    deleteReviewers
} from "../controllers/ReviewersController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/reviewers/review",verifyToken, getReviewersFromUser);
router.get("/reviewers/reviews/:id",verifyToken,getReviewersFromReviewsId);
router.get("/reviewers/:id",verifyToken,getReviewersFromReviewersId);
router.get("/reviewers/user/:id",verifyToken,getReviewersFromUserReviewers);
router.post("/reviewers",verifyToken,addReviewers);
router.patch("/reviewers",verifyToken,writeReviews);
router.delete("/reviewers/:id",verifyToken,deleteReviewers);


export default router;