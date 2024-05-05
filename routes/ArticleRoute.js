import express from "express";
import {
    getArticleById,
    getArticlesByIssue,
    getArticlesByJournal,
    createArticle,
    updateArticle,
    deleteArticle,
} from "../controllers/ArticleController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/article/:id", getArticleById);
router.get("/journal/:journal/:volume/:number",getArticlesByIssue);
router.get("/journal/:journal/article",getArticlesByJournal);
router.post("/article/:journal",createArticle);
router.patch("/article/:id",updateArticle);
router.delete("/article/:id",deleteArticle);

export default router;