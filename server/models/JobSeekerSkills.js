import mongoose from "mongoose";

const jobSeekerSkillsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skills: [{
    skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skills", required: true },
    proficiency_level: {
      type: String,
      enum: ["beginner", "intermediate", "expert"],
      required: false 
    }
  }]  
});

jobSeekerSkillsSchema.index({ user: 1 });

export default mongoose.models.JobSeekerSkills || mongoose.model("JobSeekerSkills", jobSeekerSkillsSchema);
