import mongoose from "mongoose";

const recruiterDetailsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    default: null
  },
  location: String,
  contact_info: {
    email: String,
    phone: String
  },
  picture: String 
});

export default mongoose.models.RecruiterDetails || mongoose.model("RecruiterDetails", recruiterDetailsSchema);
