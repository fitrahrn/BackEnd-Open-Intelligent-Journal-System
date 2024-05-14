import express from "express";
import {
    getReviewersFileFromReviewersId,
    createReviewersFile,
    updateReviewersFile,
    deleteReviewersFile
} from "../controllers/ReviewersFileController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/reviewers_file/:id",getReviewersFileFromReviewersId);
router.post("/reviewers_file",createReviewersFile);
router.patch("/reviewers_file/:id",updateReviewersFile);
router.delete("/reviewers_file/:id",deleteReviewersFile);


export default router;