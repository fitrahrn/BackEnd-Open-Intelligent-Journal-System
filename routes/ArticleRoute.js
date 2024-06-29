import express from "express";
import {
    getArticleById,
    getArticlesByIssue,
    getArticlesByJournal,
    getArticlesByTitle,
    getArticleByUser,
    createArticle,
    updateArticle,
    deleteArticle,
} from "../controllers/ArticleController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/article/:id", getArticleById);
router.get("/articles/submission",verifyToken,getArticleByUser);
router.get("/articles/:journal/:volume/:number",getArticlesByIssue);
router.get("/articles/:journal",getArticlesByJournal);
router.post("/article/search/:title",getArticlesByTitle);
router.post("/article/:journal",createArticle);
router.patch("/article/:id",updateArticle);
router.delete("/article/:id",deleteArticle);

export default router;