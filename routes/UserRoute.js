import express from "express";
import {
    getUserId
} from "../controllers/UserController.js"
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();
// buat endpoint
router.get('/user_id/:email', verifyToken, getUserId);

export default router;
// nanti import di index.js