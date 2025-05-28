import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createNotification,
  getMyNotifications,
  markAsRead,
  deleteNotification,
  markAllAsRead
} from "../controllers/notificationController.js";

const router = express.Router();

// Admin/system: send to a user
router.post("/", verifyToken, createNotification);

// Current user: fetch own notifications
router.get("/", verifyToken, getMyNotifications);

// Mark one as read
router.put("/:id/read", verifyToken, markAsRead);
router.patch("/mark-all-read", verifyToken, markAllAsRead);

// Delete a notification
router.delete("/:id", verifyToken, deleteNotification);

export default router;
