import express from "express";
import {
    getJournals,
    getJournalsById,
    getJournalsByPath
} from "../controllers/JournalController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/allJournals", verifyToken, getJournals);
router.get("/journal/:id",verifyToken,getJournalsById);
router.get("journal/:path",verifyToken,getJournalsByPath);


export default router;