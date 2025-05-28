import CV from "../models/cv.js";
import Application from "../models/Application.js";
import JobPosting from "../models/jobPosting.js";
import fs from "fs";
import path from "path";

// Upload CV
export const uploadCVFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No CV file uploaded" });
    }

    const allowedMimeTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    const allowedExtensions = [".pdf", ".docx"];
    const ext = path.extname(req.file.originalname).toLowerCase();

    if (!allowedMimeTypes.includes(req.file.mimetype) || !allowedExtensions.includes(ext)) {
      fs.unlinkSync(req.file.path); // delete invalid file
      return res.status(400).json({ message: "Only PDF or DOCX files are allowed" });
    }

    const { for_job } = req.body; // Accept 'for_job' from frontend

    const newCV = new CV({
      user: req.user.id,
      file_path: req.file.filename,
      for_job: for_job || null,
      created_at: Date.now(),
      is_original: !for_job, // Original CV if no job associated
    });

    const savedCV = await newCV.save();

    // ✅ Return full CV object including _id for frontend
    res.status(201).json({
      message: "CV uploaded successfully",
      _id: savedCV._id,
      file_path: savedCV.file_path,
      for_job: savedCV.for_job,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload CV", error: error.message });
  }
};

// Get all CVs for current user
export const getUserCVs = async (req, res) => {
  try {
    const cvs = await CV.find({ user: req.user.id });
    res.json(cvs);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch CVs", error: error.message });
  }
};

// Delete CV
export const deleteCV = async (req, res) => {
  try {
    const cv = await CV.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!cv) return res.status(404).json({ message: "CV not found" });

    const filePath = path.resolve(`private/uploads/cvs/${cv.file_path}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: "CV deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting CV", error: error.message });
  }
};

// Secure CV Download — for owner or recruiter of job
export const downloadCV = async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv) return res.status(404).json({ message: "CV not found" });

    const userId = req.user.id;

    // Job Seeker: owns the CV
    const isOwner = String(cv.user) === userId;

    // Recruiter: posted job to which this CV was applied
    const isRecruiter = await Application.exists({
      applied_cv: cv._id,
      job: { $in: await JobPosting.find({ recruiter: userId }).distinct("_id") },
    });

    if (!isOwner && !isRecruiter) {
      return res.status(403).json({ message: "Access denied" });
    }

    const filePath = path.resolve(`private/uploads/cvs/${cv.file_path}`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Set header to display PDF or DOCX inline
    res.setHeader("Content-Type", "application/pdf");
    res.sendFile(filePath);
  } catch (err) {
    res.status(500).json({ message: "Error serving CV file", error: err.message });
  }
};
