import mongoose from 'mongoose';

const jobRecommendationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  match_percentage: Number,
  recommendation_date: { type: Date, default: Date.now }
});

export default mongoose.models.JobRecommendation || mongoose.model("JobRecommendation", jobRecommendationSchema);
