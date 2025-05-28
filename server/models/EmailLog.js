import mongoose from 'mongoose';

const EmailLogSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  status: { type: String, enum: ['sent', 'failed'], required: true },
  error: { type: String, default: null },
  sentAt: { type: Date, default: Date.now },
});

export default mongoose.model('EmailLog', EmailLogSchema);
