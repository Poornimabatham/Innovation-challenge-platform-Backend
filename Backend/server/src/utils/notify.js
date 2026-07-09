const Notification = require("../models/Notification");

const notify = async (userId, message, type = "general", link = "") => {
  try {
    const notification = await Notification.create({ user: userId, message, type, link });

    if (global.io) {
      global.io.to(userId.toString()).emit("notification", {
        _id: notification._id,
        message,
        type,
        link,
        isRead: false,
        createdAt: notification.createdAt,
      });
    }
  } catch (err) {
    console.error("Notification error:", err.message);
  }
};

module.exports = notify;
