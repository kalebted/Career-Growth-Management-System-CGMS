import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { uploadCV } from "../middleware/upload.js";
import {
  uploadCVFile,
  getUserCVs,
  deleteCV,
  downloadCV
} from "../controllers/cvController.js";
import { generateAICV } from "../controllers/cvAIController.js";

const router = express.Router();

// Upload a CV file
router.post("/upload", verifyToken, uploadCV.single("cvFile"), uploadCVFile);

// Get all CVs for current user
router.get("/me", verifyToken, getUserCVs);

// Delete a CV by ID
router.delete("/:id", verifyToken, deleteCV);

// Download a CV (job seeker or recruiter)
router.get("/download/:id", verifyToken, downloadCV);

// Generate AI-optimized CV
router.post("/ai-generate", verifyToken, generateAICV);

export default router;
