import express from "express";
import {
    getJournals,
    getJournalsById,
    getJournalsByPath
} from "../controllers/JournalController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/allJournals", getJournals);
router.get("/journal/:path",getJournalsByPath);


export default router;