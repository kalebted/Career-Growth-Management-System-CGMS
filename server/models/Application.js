import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "JobPosting", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  applied_cv: { type: mongoose.Schema.Types.ObjectId, ref: "CV" },
  cover_letter: { type: String }, // 🔥 NEW FIELD here
  skills: [
    {
      skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skills", required: true },
      applicant_proficiency: {
        type: String,
        enum: ["no experience", "beginner", "intermediate", "expert"],
        required: true
      }
    }
  ],
  experience: { type: [String], default: [] },
  application_date: { type: Date, default: Date.now },
  current_phase: { type: String, default: null },
  status: {
    type: String,
    enum: ["submitted", "reviewing", "rejected", "accepted", "interview"],
    default: "submitted"
  },
  feedback: { type: String }
});

// Ensures 1 user cannot apply to the same job twice
applicationSchema.index({ job: 1, user: 1 }, { unique: true });

export default mongoose.models.Application || mongoose.model("Application", applicationSchema);
