import express from "express";
import {
    getUserByUsername,
    getUserWithoutItself,
    findUserByName,
    updateProfile
} from "../controllers/UserController.js"
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();
// buat endpoint
router.get('/user/get/username',getUserByUsername);
router.get('/get/contributors',getUserWithoutItself);
router.post('/user/search',findUserByName);
router.patch('/user/update',updateProfile);

export default router;
// nanti import di index.js