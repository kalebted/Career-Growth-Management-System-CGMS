import express from "express";

const router = express.Router();
import { verifyToken } from "../middleware/auth.js";

import upload from "../middleware/uploadCV.js";
import {
  handleCVUpload,
  analyzeCV,
  recommendImprovements,
  rewriteCV,
  getAnalysisByCVId,
  getRecommendationsByCVId,
  getRewrittenByCVId,
  getCVTextById,
  recommendForSpecificJob,
  getMyCVs
} from "../controllers/aiController.js";

// File upload + all-in-one AI pipeline
router.post("/upload-cv", verifyToken, upload.single("cv"), handleCVUpload);

// Modular AI task routes
router.post("/analyze-cv", verifyToken, analyzeCV);
router.post("/recommend-cv", verifyToken, recommendImprovements);
router.post("/rewrite-cv", verifyToken, rewriteCV);
router.post("/recommend-specific-job", verifyToken, recommendForSpecificJob);

// 🔍 New GET routes
router.get("/analysis/:cvId", getAnalysisByCVId);
router.get("/recommendations/:cvId", getRecommendationsByCVId);
router.get("/rewritten/:cvId", getRewrittenByCVId);
router.get("/cv-text/:cvId", getCVTextById);
router.get("/my-cvs", verifyToken, getMyCVs);



export default router;
