import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  submitApplication,
  getMyApplications,
  getApplicationsForJob,
  deleteApplication,
  updateApplicationPhase,
  updateApplicationStatus
} from "../controllers/applicationController.js";

const router = express.Router();

// Job Seeker
router.post("/", verifyToken, submitApplication);
router.get("/my", verifyToken, getMyApplications);
router.delete("/:id", verifyToken, deleteApplication);
router.put("/:id/phase", verifyToken, updateApplicationPhase);
router.put("/:id/status", verifyToken, updateApplicationStatus);
// Recruiter
router.get("/job/:jobId", verifyToken, getApplicationsForJob);

export default router;
