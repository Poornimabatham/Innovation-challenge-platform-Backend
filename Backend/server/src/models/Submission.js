const mongoose = require("mongoose");

const versionSchema = new mongoose.Schema({
  githubLink: String,
  pdfUrl: String,
  videoUrl: String,
  note: String,
  submittedAt: { type: Date, default: Date.now },
});

const submissionSchema = new mongoose.Schema(
  {
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    githubLink: { type: String },
    pdfUrl: { type: String },
    videoUrl: { type: String },
    note: { type: String },
    isLocked: { type: Boolean, default: false },
    versions: [versionSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Submission", submissionSchema);
