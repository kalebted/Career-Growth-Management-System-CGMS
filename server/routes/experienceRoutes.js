import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  addExperience,
  getExperiences,
  updateExperience,
  deleteExperience
} from "../controllers/experienceController.js";

const router = express.Router();

router.post("/", verifyToken, addExperience);
router.get("/", verifyToken, getExperiences);
router.put("/:id", verifyToken, updateExperience);
router.delete("/:id", verifyToken, deleteExperience);

export default router;
