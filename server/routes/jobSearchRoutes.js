import express from "express"; import { searchJobs } from "../controllers/jobSearchController.js";

const router = express.Router();

router.get("/search", searchJobs);

export default router;