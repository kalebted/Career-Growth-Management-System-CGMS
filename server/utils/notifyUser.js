import Notification from "../models/Notification.js";

/**
 * Sends a notification to a user
 * @param {String} userId - The ID of the user to notify
 * @param {String} content - The message content to send
 * @param {String} type - Optional: Type of notification (e.g., info, success, error)
 */
export const notifyUser = async (userId, content, type = "info") => {
  try {
    const note = new Notification({
      user: userId,
      notification_content: content,
      notification_type: type
    });
    await note.save();
  } catch (err) {
    console.error("Failed to send notification:", err.message);
    // Optional: you can throw or log this depending on how critical it is
  }
};
