import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";
import {
  createOrUpdateRecruiterDetails,
  getMyRecruiterDetails
} from "../controllers/recruiterDetailsController.js";

const router = express.Router();

router.post("/", verifyToken, uploadImage.single("picture"), createOrUpdateRecruiterDetails);
router.get("/", verifyToken, getMyRecruiterDetails);

export default router;
