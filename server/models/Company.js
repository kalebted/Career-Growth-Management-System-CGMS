import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String },
  industry: String,
  profile: String,
  description: String,
  contacts: {
    email: String,
    phone: String,
    linkedin: String,
    other: String,
  },
  locations: String,
  website: {
    type: String,
    default: "",
  },
  founded_date: Date,
  employees_count: Number,
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Or "RecruiterDetails" if preferred
    required: true,
  },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Company || mongoose.model("Company", companySchema);
