const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who receives the notification
  actionBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who performed the action (like, comment, follow)
  action: String, // Like, Comment, Follow
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});

module.exports = mongoose.model("Notification", NotificationSchema);
