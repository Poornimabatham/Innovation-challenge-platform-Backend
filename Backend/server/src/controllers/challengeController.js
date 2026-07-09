const Challenge = require("../models/Challenge");

exports.createChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.create({
      ...req.body,
      organizer: req.user._id,
    });
    res.status(201).json({ success: true, data: challenge });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().populate(
      "organizer",
      "name email",
    );
    res.json({ success: true, data: challenges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate(
      "organizer",
      "name email",
    );
    if (!challenge)
      return res
        .status(404)
        .json({ success: false, message: "Challenge not found" });
    res.json({ success: true, data: challenge });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge)
      return res
        .status(404)
        .json({ success: false, message: "Challenge not found" });
    if (challenge.organizer.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });

    const updated = await Challenge.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge)
      return res
        .status(404)
        .json({ success: false, message: "Challenge not found" });
    if (challenge.organizer.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });

    await challenge.deleteOne();
    res.json({ success: true, message: "Challenge deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.publishChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      { status: "published" },
      { new: true },
    );
    res.json({ success: true, data: challenge });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.archiveChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      { status: "archived" },
      { new: true },
    );
    res.json({ success: true, data: challenge });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cloneChallenge = async (req, res) => {
  try {
    const original = await Challenge.findById(req.params.id);
    if (!original)
      return res
        .status(404)
        .json({ success: false, message: "Challenge not found" });

    const cloned = await Challenge.create({
      title: `${original.title} (Copy)`,
      description: original.description,
      organizer: req.user._id,
      deadline: original.deadline,
      tags: original.tags,
      prizes: original.prizes,
      maxTeamSize: original.maxTeamSize,
      status: "draft",
    });
    res.status(201).json({ success: true, data: cloned });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
