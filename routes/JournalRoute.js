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
router.get("/journal",verifyToken,getJournalsByUser);
router.post("/journal",verifyToken,createJournal);
router.patch("/journal/:path",verifyToken,updateJournal);
router.delete("/journal/:path",verifyToken,deleteJournal);


export default router;