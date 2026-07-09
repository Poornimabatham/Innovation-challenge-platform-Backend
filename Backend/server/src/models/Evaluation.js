const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema(
  {
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
    },
    judge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    rubric: {
      innovation: { type: Number, min: 0, max: 10, default: 0 },
      technical: { type: Number, min: 0, max: 10, default: 0 },
      presentation: { type: Number, min: 0, max: 10, default: 0 },
      impact: { type: Number, min: 0, max: 10, default: 0 },
      feasibility: { type: Number, min: 0, max: 10, default: 0 },
    },
    totalScore: { type: Number, default: 0 },
    feedback: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Evaluation", evaluationSchema);
