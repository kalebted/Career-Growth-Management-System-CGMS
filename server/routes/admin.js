import express from "express";
import { getAdminDashboard, getAllUsersByRole, deleteUserById } from "../controllers/adminController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", verifyToken, verifyAdmin, getAdminDashboard);
router.get("/users/:role", verifyToken, verifyAdmin, getAllUsersByRole);
router.delete("/users/:id", verifyToken, verifyAdmin, deleteUserById);

export default router;
