import express from "express";
import {
    getArticleById,
    getArticlesByIssue,
    getArticlesByJournal
} from "../controllers/ArticleController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/article/:id", getArticleById);
router.get("/journal/:journal/:volume/:number",getArticlesByIssue);
router.get("/journal/:journal/article",getArticlesByJournal);


export default router;