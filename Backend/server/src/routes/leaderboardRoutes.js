const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Evaluation = require("../models/Evaluation");
const Submission = require("../models/Submission");

router.get("/:challengeId", protect, async (req, res) => {
  try {
    const submissions = await Submission.find({
      challenge: req.params.challengeId,
      isLocked: true,
    }).populate("team", "name");

    const leaderboard = await Promise.all(
      submissions.map(async (s) => {
        const evaluations = await Evaluation.find({ submission: s._id });
        const avgScore = evaluations.length
          ? evaluations.reduce((a, b) => a + b.totalScore, 0) /
            evaluations.length
          : 0;
        return {
          team: s.team?.name,
          submissionId: s._id,
          avgScore: avgScore.toFixed(2),
          evaluationCount: evaluations.length,
        };
      }),
    );

    leaderboard.sort((a, b) => b.avgScore - a.avgScore);
    res.json({ success: true, data: leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
