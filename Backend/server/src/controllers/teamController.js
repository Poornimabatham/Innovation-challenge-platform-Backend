const Team = require("../models/Team");
const crypto = require("crypto");

exports.createTeam = async (req, res) => {
  try {
    const { name, challenge } = req.body;
    if (!name || !challenge)
      return res
        .status(400)
        .json({ success: false, message: "Name and challenge required" });

    const existing = await Team.findOne({ challenge, members: req.user._id });
    if (existing)
      return res
        .status(400)
        .json({
          success: false,
          message: "Already in a team for this challenge",
        });

    const inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    const team = await Team.create({
      name,
      challenge,
      leader: req.user._id,
      members: [req.user._id],
      inviteCode,
    });

    res.status(201).json({ success: true, data: team });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("leader", "name email")
      .populate("members", "name email")
      .populate("challenge", "title");
    res.json({ success: true, data: teams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user._id })
      .populate("leader", "name email")
      .populate("members", "name email")
      .populate("challenge", "title");
    res.json({ success: true, data: teams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.joinTeam = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const team = await Team.findOne({ inviteCode });
    if (!team)
      return res
        .status(404)
        .json({ success: false, message: "Invalid invite code" });

    if (team.members.includes(req.user._id))
      return res
        .status(400)
        .json({ success: false, message: "Already in this team" });

    if (team.members.length >= team.maxSize)
      return res.status(400).json({ success: false, message: "Team is full" });

    team.members.push(req.user._id);
    await team.save();

    res.json({ success: true, data: team });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.leaveTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team)
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });

    if (team.leader.toString() === req.user._id.toString())
      return res
        .status(400)
        .json({
          success: false,
          message: "Leader cannot leave. Delete team instead.",
        });

    team.members = team.members.filter(
      (m) => m.toString() !== req.user._id.toString(),
    );
    await team.save();

    res.json({ success: true, message: "Left team successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team)
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });

    if (team.leader.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ success: false, message: "Only leader can delete team" });

    await team.deleteOne();
    res.json({ success: true, message: "Team deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
