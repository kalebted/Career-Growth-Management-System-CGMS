import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  addCertification,
  getCertifications,
  deleteCertification
} from "../controllers/certificationController.js";

import { uploadCertification } from "../middleware/upload.js";

const router = express.Router();

// File + URL upload
router.post("/", verifyToken, uploadCertification.single("certificate_file"), addCertification);
router.get("/", verifyToken, getCertifications);
router.delete("/:id", verifyToken, deleteCertification);

export default router;
