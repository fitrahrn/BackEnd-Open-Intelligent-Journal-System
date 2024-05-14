import express from "express";
import {
    getDiscussionFromReviewsId,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion
} from "../controllers/DiscussionController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();
router.get("/discussion/:id",getDiscussionFromReviewsId);
router.post("/discussion",createDiscussion);
router.patch("/discussion/:id",updateDiscussion);
router.delete("/discussion/:id",deleteDiscussion);


export default router;