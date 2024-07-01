import express from "express";
import {
    getRolesRequest,
    getReviewersFromJournal,
    getRoleFromUser,
    requestRoles,
    answerRequestRoles,
    addRole,
    updateRole,
    deleteRole
} from "../controllers/RoleController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/role/reviewers/:path",getReviewersFromJournal);
router.get("/role/user",getRoleFromUser);
router.get("/role/request",getRolesRequest);
router.post("/role/request",requestRoles);
router.post("/role/request/answer",answerRequestRoles);
router.post("/role",addRole);
router.patch("/role/:path",updateRole);
router.delete("/role/:id",deleteRole);


export default router;