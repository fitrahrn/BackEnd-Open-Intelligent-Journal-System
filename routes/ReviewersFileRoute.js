import express from "express";
import {
    getReviewersFileFromReviewersId,
    createReviewersFile,
    updateReviewersFile,
    deleteReviewersFile
} from "../controllers/ReviewersFileController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/reviewers_file/:id",verifyToken,getReviewersFileFromReviewersId);
router.post("/reviewers_file",verifyToken,createReviewersFile);
router.patch("/reviewers_file/:id",verifyToken,updateReviewersFile);
router.delete("/reviewers_file/:id",verifyToken,deleteReviewersFile);


export default router;