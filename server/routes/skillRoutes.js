import express from "express";
import { getAllSkills, searchSkills } from "../controllers/skillsController.js";

const router = express.Router();

router.get("/", (req, res) => {
  if (req.query.search) {
    return searchSkills(req, res);
  } else {
    return getAllSkills(req, res);
  }
});

export default router;
