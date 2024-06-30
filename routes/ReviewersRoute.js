import express from "express";
import {
    getReviewersFromUser,
    getReviewersFromReviewsId,
    getReviewersFromUserReviewers,
    addReviewers,
    writeReviews,
    deleteReviewers
} from "../controllers/ReviewersController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/reviewers/review", getReviewersFromUser);
router.get("/reviewers/:id",getReviewersFromReviewsId);
router.get("/reviewers/user/:id",getReviewersFromUserReviewers);
router.post("/reviewers",addReviewers);
router.patch("/reviewers",writeReviews);
router.delete("/reviewers/:id",deleteReviewers);


export default router;