const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["challenge", "team", "submission", "evaluation", "general"],
      default: "general",
    },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
