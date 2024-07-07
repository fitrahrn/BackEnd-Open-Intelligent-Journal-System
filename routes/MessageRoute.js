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

router.get("/message/:id",verifyToken,getMessageFromDiscussionId);
router.get("/message/user/:id",verifyToken,getMessageFromParticipantId);
router.post("/message",verifyToken,createMessage);
router.patch("/message/:id",verifyToken,updateMessage);
router.delete("/message/:id",verifyToken,deleteMessage);


export default router;