import express from "express";
import {
    getArticleFileFromArticleId,
    createArticleFile,
    updateArticleFile,
    deleteArticleFile,
    getArticleFileFromPhase
} from "../controllers/ArticleFileController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/article_file/:id",verifyToken,getArticleFileFromArticleId);
router.post("/article_file/:id",verifyToken,getArticleFileFromPhase);
router.post("/article_file",verifyToken,createArticleFile);
router.patch("/article_file/:id",verifyToken,updateArticleFile);
router.delete("/article_file/:id",verifyToken,deleteArticleFile);


export default router;