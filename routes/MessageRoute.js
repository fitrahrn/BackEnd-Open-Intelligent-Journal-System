import express from "express";
import {
    getMessageFromDiscussionId,
    getMessageFromParticipantId,
    createMessage,
    updateMessage,
    deleteMessage
} from "../controllers/MessageController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/message/:id",getMessageFromDiscussionId);
router.get("/message/participant/:id",getMessageFromParticipantId);
router.post("/message",createMessage);
router.patch("/message/:id",updateMessage);
router.delete("/message/:id",deleteMessage);


export default router;