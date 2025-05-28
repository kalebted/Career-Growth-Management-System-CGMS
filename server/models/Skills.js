import mongoose from 'mongoose';

const skillsSchema = new mongoose.Schema({
  skill_name: { type: String, required: true, unique: true }
});

export default mongoose.models.Skills || mongoose.model("Skills", skillsSchema);
