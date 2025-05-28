import CV from "../models/cv.js";
import JobPosting from "../models/jobPosting.js";
import fs from "fs";
import path from "path";

// Mocked AI CV Generator
export const generateAICV = async (req, res) => {
  const { baseCvId, jobId } = req.body;

  try {
    const baseCV = await CV.findOne({ _id: baseCvId, user: req.user.id });
    if (!baseCV) {
      return res.status(404).json({ message: "Base CV not found" });
    }

    const job = await JobPosting.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Simulate AI transformation (real app would use OpenAI API here)
    const originalFilePath = path.resolve(`private/uploads/cvs/${baseCV.file_path}`);
    const modifiedContent = `AI-modified CV based on job: ${job.job_title}\n\nOriginal content:\n`;

    const aiFileName = `${Date.now()}-ai-${baseCV.file_path}`;
    const aiFilePath = path.resolve(`private/uploads/cvs/${aiFileName}`);

    const original = fs.readFileSync(originalFilePath, "utf-8");
    fs.writeFileSync(aiFilePath, `${modifiedContent}${original}`);

    // Save AI-generated CV to DB
    const newCV = new CV({
      user: req.user.id,
      file_path: aiFileName,
      created_at: new Date(),
      is_original: false,
      for_job: job._id,
      parent_cv: baseCV._id
    });

    await newCV.save();

    res.status(201).json({
      message: "AI CV generated and saved",
      cv: newCV
    });

  } catch (error) {
    res.status(500).json({ message: "AI CV generation failed", error: error.message });
  }
};
