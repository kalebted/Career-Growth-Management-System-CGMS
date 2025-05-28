import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job_title: String,
  company: String,
  start_date: Date,
  end_date: {
    type: Date,
    default: null
  },  
  description: String
});

export default mongoose.models.Experience || mongoose.model("Experience", experienceSchema);
