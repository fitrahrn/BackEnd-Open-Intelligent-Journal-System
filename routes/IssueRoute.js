import express from "express";
import {
    getIssueById,
    getIssueByJournal,
    getIssueByVolumeNumber,
    createIssue,
    updateIssue,
    deleteIssue
} from "../controllers/IssueController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/issue/id/:id", getIssueById);
router.get("/issue/:journal",getIssueByJournal);
router.get("/issue/:journal/:volume/:number",getIssueByVolumeNumber)
router.post("/issue/:journal",createIssue);
router.patch("/issue/:id",updateIssue);
router.delete("/issue/:id",deleteIssue);

export default router;