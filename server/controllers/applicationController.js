import Application from "../models/Application.js";
import JobPosting from "../models/jobPosting.js";
import CV from "../models/cv.js";
import { notifyUser } from "../utils/notifyUser.js";
import sendEmail from "../utils/sendEmail.js";
import {
  applicationSubmitted,
  notifyRecruiterOfApplication,
  applicationPhaseUpdated,
} from "../templates/notifications.js";
import { applicationPhaseUpdated as applicationPhaseEmailTemplate } from "../utils/emailTemplates.js";
import User from "../models/User.js";

// APPLY to a job (job seeker only)
export const submitApplication = async (req, res) => {
  const { jobId, cvId, cover_letter, skills, experience } = req.body;

  try {
    if (req.user.role !== "job_seeker") {
      return res.status(403).json({ message: "Only job seekers can apply" });
    }

    const job = await JobPosting.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const cv = await CV.findOne({ _id: cvId, user: req.user.id });
    if (!cv) return res.status(404).json({ message: "CV not found or not yours" });

    const exists = await Application.findOne({ job: jobId, user: req.user.id });
    if (exists) return res.status(409).json({ message: "Already applied to this job" });

    if (skills && skills.length > 0) {
      for (const s of skills) {
        if (!s.skill || !s.applicant_proficiency) {
          return res.status(400).json({
            message: "Each skill entry must have a skill ID and an applicant proficiency level",
          });
        }
      }
    }

    if (experience && !Array.isArray(experience)) {
      return res.status(400).json({ message: "Experience must be an array of strings" });
    }

    const application = new Application({
      job: jobId,
      user: req.user.id,
      applied_cv: cvId,
      cover_letter: cover_letter || null,
      skills: skills || [],
      experience: experience || [],
    });

    await application.save();

    const applicant = await User.findById(req.user.id);
    const recruiter = await User.findById(job.recruiter);

    await notifyUser(
      req.user.id,
      `You’ve successfully applied to ${job.job_title} at ${job.company || "a recruiter"}`,
      "success"
    );

    await notifyUser(
      job.recruiter,
      `A new applicant (${applicant.name}) has applied for "${job.job_title}"`,
      "info"
    );

    // === EMAIL NOTIFICATIONS ===
    try {
      await sendEmail(
        applicant.email,
        "Application Submitted",
        applicationSubmitted(applicant.name, job.job_title)
      );

      await sendEmail(
        recruiter.email,
        "New Application Received",
        notifyRecruiterOfApplication(
          recruiter.name,
          applicant.name,
          job.job_title
        )
      );
    } catch (emailErr) {
      console.warn("Email notification error:", emailErr.message);
    }

    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    res.status(500).json({ message: "Failed to apply", error: err.message });
  }
};

// Get my applications (job seeker)
export const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user.id })
      .populate({
        path: "job",
        populate: { path: "required_skills.skill", select: "skill_name" },
      })
      .populate("applied_cv")
      .populate("skills.skill", "skill_name");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications", error: err.message });
  }
};

// Recruiter: Get applications for a job
export const getApplicationsForJob = async (req, res) => {
  const jobId = req.params.jobId;

  try {
    const job = await JobPosting.findById(jobId);
    if (!job || String(job.recruiter) !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this job’s applications" });
    }

    const apps = await Application.find({ job: jobId })
      .populate("user", "name email")
      .populate("applied_cv")
      .populate("skills.skill", "skill_name");

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching applications", error: err.message });
  }
};

// DELETE/Withdraw Application
export const deleteApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app || String(app.user) !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to withdraw this application" });
    }

    await app.deleteOne();
    res.json({ message: "Application withdrawn" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete application", error: err.message });
  }
};

// Move application phase from one to the next
export const updateApplicationPhase = async (req, res) => {
  const { id } = req.params;
  const { phase } = req.body;

  try {
    const application = await Application.findById(id).populate("job");
    if (!application || String(application.job.recruiter) !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const job = application.job;

    if (!job.hiring_process.includes(phase)) {
      return res.status(400).json({
        message: `Invalid phase. This job supports: ${job.hiring_process.join(", ")}`,
      });
    }

    application.current_phase = phase;
    await application.save();

    const applicant = await User.findById(application.user);

    await notifyUser(
      application.user,
      `Your application for ${job.job_title} has been moved to the "${phase}" stage.`,
      "info"
    );

    // Email Notification
    try {
      await sendEmail(
        applicant.email,
        "Application Update",
        applicationPhaseUpdated(applicant.name, job.job_title, phase)
      );
    } catch (emailErr) {
      console.warn("Email sending failed for phase update:", emailErr.message);
    }

    res.json({ message: `Application updated to phase: ${phase}`, application });
  } catch (err) {
    res.status(500).json({ message: "Failed to update phase", error: err.message });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["submitted", "reviewing", "rejected", "accepted", "interview"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const application = await Application.findById(id).populate("job");
    if (!application || String(application.job.recruiter) !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    application.status = status;
    await application.save();

    const applicant = await User.findById(application.user);

    await notifyUser(
      application.user,
      `Your application for ${application.job.job_title} has been moved to the "${status}" stage.`,
      "info"
    );

    try {
      await sendEmail(
        applicant.email,
        "Your Application Status Has Been Updated",
        applicationPhaseEmailTemplate(applicant.name, application.job.job_title, status)
      );
    } catch (emailErr) {
      console.warn("Email sending failed for phase update:", emailErr.message);
    }

    res.json({ message: "Application status updated", application });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
};
