import express from "express";
import{
    login,
    register,
    logout,
    getUsers,
    // addHeader,
} from "../controllers/AuthController.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();
// buat endpoint
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/users',verifyToken ,getUsers);
router.get('/token', refreshToken);
// router.all('*',addHeader)

export default router;