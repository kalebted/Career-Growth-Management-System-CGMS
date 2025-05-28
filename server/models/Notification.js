import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notification_type: String,
  notification_content: String,
  sent_date: { type: Date, default: Date.now },
  read_status: { type: String, enum: ['unread', 'read'], default: 'unread' }
});

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
