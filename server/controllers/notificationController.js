import Notification from "../models/Notification.js";

// Create a notification
export const createNotification = async (req, res) => {
  try {
    const { userId, notification_content, notification_type } = req.body;

    const note = new Notification({
      user: userId,
      notification_content,
      notification_type
    });

    await note.save();
    res.status(201).json({ message: "Notification created", notification: note });
  } catch (err) {
    res.status(500).json({ message: "Failed to create notification", error: err.message });
  }
};

// Get all notifications for current user
export const getMyNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.user.id }).sort({ sent_date: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications", error: err.message });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const note = await Notification.findById(req.params.id);
    if (!note || String(note.user) !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    note.read_status = "read";
    await note.save();
    res.json({ message: "Marked as read", notification: note });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
};
// Mark all unread notifications as read for the current user
export const markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user.id, read_status: 'unread' },
      { $set: { read_status: 'read' } }
    );
    res.json({ message: `${result.modifiedCount} notifications marked as read` });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark notifications as read", error: err.message });
  }
};


// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const note = await Notification.findById(req.params.id);
    if (!note || String(note.user) !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await note.deleteOne();
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete notification", error: err.message });
  }
};
