import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  addSkillToJob,
  removeSkillFromJob,
  getSkillsForJob
} from "../controllers/jobSkillController.js";

const router = express.Router();

// Add a skill to a job (recruiter only)
router.post("/:jobId", verifyToken, addSkillToJob);

// Remove a skill from a job
router.delete("/:jobId/:skillId", verifyToken, removeSkillFromJob);

// Get all skills required for a job
router.get("/:jobId", getSkillsForJob);

export default router;
