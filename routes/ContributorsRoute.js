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

router.get("/contributors/id/:id", getContributorsById);
router.get("/contributors/article/:id",getContributorsFromArticle);
router.get("/contributors/user/:id",getContributorsFromUser)
router.post("/contributors",addContributors);
router.patch("/contributors/:id",updateContributors);
router.delete("/contributors/:id",deleteContributors);


export default router;