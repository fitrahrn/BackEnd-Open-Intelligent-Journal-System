import express from "express";
import {
    getArticleById,
    getArticlesByIssue,
    getArticlesByJournal,
    getArticlesByTitle,
    getArticleByUser,
    getArticleByUserName,
    createArticle,
    updateArticle,
    addCitation,
    deleteArticle,
} from "../controllers/ArticleController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/article/:id", getArticleById);
router.get("/articles/submission",verifyToken,getArticleByUser);
router.get("/articles/citation/:username",getArticleByUserName);
router.get("/articles/:journal/:volume/:number",getArticlesByIssue);
router.get("/articles/:journal",getArticlesByJournal);
router.post("/article/search",getArticlesByTitle);
router.post("/article/:journal",verifyToken,createArticle);
router.patch("/article/:id",verifyToken,updateArticle);
router.patch("/article/cite/:id",addCitation);
router.delete("/article/:id",verifyToken,deleteArticle);

export default router;