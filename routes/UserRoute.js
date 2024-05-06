import express from "express";
import {
    getUserId,
    getUserByEmail,
    getUserByUsername,
    findUserByName
} from "../controllers/UserController.js"
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();
// buat endpoint
router.get('/user_id/:email', verifyToken, getUserId);
router.get('/user/:email',getUserByEmail);
router.get('/username/:username',getUserByUsername);
router.post('/user/name',findUserByName);

export default router;
// nanti import di index.js