import express from "express";
import {
    getRoles,
    getRoleFromJournal,
    getReviewersFromJournal,
    getAuthorFromJournal,
    getEditorFromJournal,
    getRoleFromUser,
    addRole,
    updateRole,
    deleteRole
} from "../controllers/RoleController.js";
import {verifyToken} from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/role", getRoles);
router.get("/role/journal/:path",getRoleFromJournal);
router.get("/role/reviewers/:path",getReviewersFromJournal);
router.get("/role/author/:path",getAuthorFromJournal);
router.get("/role/editor/:path",getEditorFromJournal);
router.get("/role/:user_id",getRoleFromUser);
router.post("/role",addRole);
router.patch("/role/:path",updateRole);
router.delete("/role/:id",deleteRole);


export default router;