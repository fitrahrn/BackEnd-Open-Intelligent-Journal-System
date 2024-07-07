import express from "express";
import {
    getDiscussionFromReviewsId,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion
} from "../controllers/DiscussionController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();
router.get("/discussion/:id",verifyToken,getDiscussionFromReviewsId);
router.post("/discussion",verifyToken,createDiscussion);
router.patch("/discussion/:id",verifyToken,updateDiscussion);
router.delete("/discussion/:id",verifyToken,deleteDiscussion);


export default router;