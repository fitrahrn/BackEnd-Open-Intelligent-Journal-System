import express from "express";
import {
    getArticleFileFromArticleId,
    createArticleFile,
    updateArticleFile,
    deleteArticleFile
} from "../controllers/ArticleFileController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/article_file/:id",getArticleFileFromArticleId);
router.post("/article_file",createArticleFile);
router.patch("/article_file/:id",updateArticleFile);
router.delete("/article_file/:id",deleteArticleFile);


export default router;