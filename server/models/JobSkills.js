import mongoose from "mongoose";

const jobSkillsSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobPosting",
    required: true,
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skills",
    required: true,
  },
  required_proficiency: String,
});

jobSkillsSchema.index({ job: 1, skill: 1 }, { unique: true });

export default mongoose.models.JobSkills || mongoose.model("JobSkills", jobSkillsSchema);
