import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getCompaniesByRecruiter
} from "../controllers/companyController.js";
import { uploadLogo } from "../middleware/upload.js";

const router = express.Router();

// Public
router.get("/", getCompanies);
router.get("/:id", getCompanyById);

// Protected
router.post("/", verifyToken, uploadLogo.single("logo"), createCompany);
router.put("/:id", verifyToken, uploadLogo.single("logo"), updateCompany); // ✅ Fixed!
router.delete("/:id", verifyToken, deleteCompany);
router.get("/recruiter/my", verifyToken, getCompaniesByRecruiter);

export default router;
