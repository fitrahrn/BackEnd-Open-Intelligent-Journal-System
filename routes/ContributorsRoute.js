import express from "express";
import {
    getContributorsById,
    getContributorsFromArticle,
    getContributorsFromUser,
    addContributors,
    updateContributors,
    deleteContributors

} from "../controllers/ContributorsController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/contributors/id/:id",verifyToken, getContributorsById);
router.get("/contributors/article/:id",verifyToken,getContributorsFromArticle);
router.get("/contributors/user/:id",verifyToken,getContributorsFromUser)
router.post("/contributors",verifyToken,addContributors);
router.patch("/contributors/:id",verifyToken,updateContributors);
router.delete("/contributors/:id",verifyToken,deleteContributors);


export default router;