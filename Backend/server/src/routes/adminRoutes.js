const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const User = require("../models/User");
const Challenge = require("../models/Challenge");
const Team = require("../models/Team");
const Submission = require("../models/Submission");
const Evaluation = require("../models/Evaluation");
const cache = require("../utils/cache");

router.get("/analytics", protect, authorize("admin"), async (req, res) => {
  try {
    const cached = await cache.get("admin:analytics");
    if (cached) return res.json({ success: true, data: cached, cached: true });

    const [users, challenges, teams, submissions, evaluations] = await Promise.all([
      User.countDocuments(),
      Challenge.countDocuments(),
      Team.countDocuments(),
      Submission.countDocuments(),
      Evaluation.countDocuments(),
    ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const challengesByStatus = await Challenge.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const recentUsers = await User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentChallenges = await Challenge.find()
      .select("title status createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    const data = { counts: { users, challenges, teams, submissions, evaluations }, usersByRole, challengesByStatus, recentUsers, recentChallenges };

    await cache.set("admin:analytics", data, 120);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/users/:id", protect, authorize("admin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await cache.del("admin:analytics");
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
