import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
  updateJobStatus,
} from "../controllers/jobController.js";

const router = express.Router();

// Public route: view all jobs
router.get("/", getAllJobs);

// Recruiter-only routes
router.post("/", verifyToken, createJob);
router.get("/my", verifyToken, getMyJobs);
router.put("/:id", verifyToken, updateJob);
router.delete("/:id", verifyToken, deleteJob);
router.get("/:id", getJobById);
router.put("/:id/status", verifyToken, updateJobStatus);

export default router;
