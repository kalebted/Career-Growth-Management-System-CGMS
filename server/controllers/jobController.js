import JobPosting from "../models/jobPosting.js";

// VALID ENUMS
const validTypes = ["full-time", "part-time", "contract", "internship"];
const validModes = ["remote", "on-site", "hybrid"];

const validateJobFields = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate) {
    if (!data.job_title) errors.push("Job title is required");
    if (!data.job_description) errors.push("Job description is required");
    if (!data.location) errors.push("Location is required");
    if (!data.application_deadline) errors.push("Application deadline is required");
  }

  if (data.application_deadline && isNaN(Date.parse(data.application_deadline))) {
    errors.push("Invalid application deadline format");
  }

  if (data.work_type && !validTypes.includes(data.work_type)) {
    errors.push("Invalid work_type");
  }

  if (data.work_mode && !validModes.includes(data.work_mode)) {
    errors.push("Invalid work_mode");
  }

  if (data.required_skills && Array.isArray(data.required_skills)) {
    for (const s of data.required_skills) {
      if (!s.skill || !s.proficiency_level) {
        errors.push("Each required skill must include both 'skill' and 'proficiency_level'");
        break;
      }
    }
  }

  return errors;
};

// CREATE Job (Recruiter Only)
export const createJob = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can post jobs" });
    }

    const jobData = req.body;
    const errors = validateJobFields(jobData);

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const job = new JobPosting({
      recruiter: req.user.id,
      job_title: jobData.job_title,
      job_description: jobData.job_description,
      requirements: jobData.requirements || [],
      required_skills: jobData.required_skills || [],
      location: jobData.location,
      application_deadline: jobData.application_deadline,
      hiring_process: jobData.hiring_process || [],
      job_category: jobData.job_category || "Uncategorized",
      work_type: jobData.work_type,
      work_mode: jobData.work_mode
    });

    await job.save();
    res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Failed to post job", error: error.message });
  }
};

// UPDATE Job
export const updateJob = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);

    if (!job || String(job.recruiter) !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to edit this job" });
    }

    const updates = req.body;
    const errors = validateJobFields(updates, true);

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    Object.assign(job, updates);
    await job.save();

    res.json({ message: "Job updated successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Failed to update job", error: error.message });
  }
};

// GET All Jobs (Public)
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await JobPosting.find({ status: "open" })
      .populate("recruiter", "name email")
      .populate("required_skills.skill", "skill_name")
      .sort({ posting_date: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
};

// GET Recruiter’s Jobs
export const getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can view their jobs" });
    }

    const jobs = await JobPosting.find({ recruiter: req.user.id })
      .populate("required_skills.skill", "skill_name")
      .sort({ posting_date: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recruiter jobs", error: error.message });
  }
};

// UPDATE Job Status
export const updateJobStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const job = await JobPosting.findById(id);

    if (!job || String(job.recruiter) !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!["open", "closed"].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    job.status = status;
    await job.save();

    res.json({ message: 'Job status updated', job });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update job status', error: err.message });
  }
};

// DELETE Job
export const deleteJob = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);

    if (!job || String(job.recruiter) !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this job" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete job", error: error.message });
  }
};

// GET Job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id)
      .populate("required_skills.skill", "skill_name")
      .populate("recruiter", "name email");

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job", error: error.message });
  }
};
