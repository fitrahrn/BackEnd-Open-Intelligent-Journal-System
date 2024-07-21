import express from "express";
import{
    inviteReviewer,
    answerSubmission,
    reviewCertificate,
    
    // addHeader,
} from "../controllers/EmailController.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();
// buat endpoint
router.post('/email/reviewer', inviteReviewer);
router.post('/email/submission', answerSubmission);
router.post('/email/certificate', reviewCertificate);

export default router;