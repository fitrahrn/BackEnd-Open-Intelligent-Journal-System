import express from "express";
import {
    getParticipant,
    getParticipantFromDiscussionId,
    getParticipantFromUserId,
    createParticipant,
    updateParticipant,
    deleteParticipant
} from "../controllers/ParticipantController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/participant", getParticipant);
router.get("/participant/:id",getParticipantFromDiscussionId);
router.get("/participant/user/:id",getParticipantFromUserId);
router.post("/participant",createParticipant);
router.patch("/participant/:id",updateParticipant);
router.delete("/participant/:id",deleteParticipant);


export default router;