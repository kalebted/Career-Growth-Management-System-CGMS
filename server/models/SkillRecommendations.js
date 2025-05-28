import mongoose from 'mongoose';

const skillRecommendationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skills', required: true },
  recommendation_reason: String,
  recommendation_date: { type: Date, default: Date.now }
});

export default mongoose.model('SkillRecommendations', skillRecommendationSchema);
