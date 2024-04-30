import express from "express";
import {
    getIssueById,
    getIssueByJournal
} from "../controllers/IssueController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/issue/id/:id", getIssueById);
router.get("/journal/:journal/issue",getIssueByJournal);


export default router;