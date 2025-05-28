import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";
import {
  createOrUpdateDetails,
  getMyDetails
} from "../controllers/jobSeekerDetailsController.js";

const router = express.Router();

router.post("/", verifyToken, uploadImage.single("picture"), createOrUpdateDetails);


router.get("/", verifyToken, getMyDetails);

export default router;
