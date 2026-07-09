const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    deadline: { type: Date, required: true },
    tags: [String],
    prizes: { type: String },
    maxTeamSize: { type: Number, default: 4 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Challenge", challengeSchema);
