import express from "express";
import {
    getJournals,
    getJournalsByUser,
    getJournalsByPath,
    createJournal,
    updateJournal,
    deleteJournal
} from "../controllers/JournalController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/journals", getJournals);
router.get("/journal/:path",getJournalsByPath);
router.get("/journal",getJournalsByUser);
router.post("/journal",createJournal);
router.patch("/journal/:path",updateJournal);
router.delete("/journal/:path",deleteJournal);


export default router;