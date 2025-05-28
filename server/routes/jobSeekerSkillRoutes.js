import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  addSkill,
  getMySkills,
  removeSkill
} from "../controllers/jobSeekerSkillController.js";

const router = express.Router();

router.post("/", verifyToken, addSkill);
router.get("/", verifyToken, getMySkills);
router.delete("/:skillId", verifyToken, removeSkill);

export default router;
