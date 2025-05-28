import mongoose from "mongoose";

const jobPostingSchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  job_title: { type: String, required: true },
  job_description: String,
  requirements: {
    type: [String],
    default: [],
  },
  required_skills: [{
    skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skills", required: true },
    proficiency_level: {
      type: String,
      enum: ["beginner", "intermediate", "expert"],
      required: true // ✅ required for recruiters
    }
  }],
  location: {
    type: String,
    required: true,
  },
  work_type: {
    type: String,
    enum: ["full-time", "part-time", "contract", "internship"],
    required: true
  },
  work_mode: {
    type: String,
    enum: ["remote", "on-site", "hybrid"],
    required: true
  },  
  job_category: {
    type: String,
    required: false,
    trim: true,
    default: "Uncategorized"
  },
  application_deadline: Date,
  posting_date: { type: Date, default: Date.now },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  hiring_process: {
    type: [String],
    default: ['submitted', 'reviewing', 'interview', 'accepted', 'rejected'],
  },
})

export default mongoose.models.JobPosting || mongoose.model("JobPosting", jobPostingSchema);
