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

router.get("/role/reviewers/:path",verifyToken,getReviewersFromJournal);
router.get("/role/user",verifyToken,getRoleFromUser);
router.get("/role/request",verifyToken,getRolesRequest);
router.post("/role/request",verifyToken,requestRoles);
router.post("/role/request/answer",verifyToken,answerRequestRoles);
router.post("/role",verifyToken,addRole);
router.patch("/role/:path",verifyToken,updateRole);
router.delete("/role/:id",verifyToken,deleteRole);


export default router;