import mongoose from "mongoose";

const cvSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  file_path: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  is_original: { type: Boolean, default: true },
  for_job: { type: mongoose.Schema.Types.ObjectId, ref: "JobPosting" },
});

export default mongoose.models.CV || mongoose.model("CV", cvSchema);
