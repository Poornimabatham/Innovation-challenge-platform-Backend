const Submission = require("../models/Submission");
const Team = require("../models/Team");

exports.createSubmission = async (req, res) => {
  try {
    const { team, challenge, githubLink, pdfUrl, videoUrl, note } = req.body;

    const teamDoc = await Team.findById(team);
    if (!teamDoc)
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });

    if (!teamDoc.members.includes(req.user._id))
      return res
        .status(403)
        .json({ success: false, message: "Not a team member" });

    const existing = await Submission.findOne({ team, challenge });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Submission already exists" });

    const submission = await Submission.create({
      team,
      challenge,
      githubLink,
      pdfUrl,
      videoUrl,
      note,
      versions: [{ githubLink, pdfUrl, videoUrl, note }],
    });

    res.status(201).json({ success: true, data: submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission)
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });

    if (submission.isLocked)
      return res
        .status(400)
        .json({ success: false, message: "Submission is locked" });

    const { githubLink, pdfUrl, videoUrl, note } = req.body;

    submission.versions.push({ githubLink, pdfUrl, videoUrl, note });
    submission.githubLink = githubLink || submission.githubLink;
    submission.pdfUrl = pdfUrl || submission.pdfUrl;
    submission.videoUrl = videoUrl || submission.videoUrl;
    submission.note = note || submission.note;

    await submission.save();
    res.json({ success: true, data: submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.lockSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { isLocked: true },
      { new: true },
    );
    if (!submission)
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });

    res.json({ success: true, data: submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("team", "name")
      .populate("challenge", "title")
      .populate("team");
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user._id });
    const teamIds = teams.map((t) => t._id);
    const submissions = await Submission.find({ team: { $in: teamIds } })
      .populate("team", "name")
      .populate("challenge", "title");
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("team", "name members")
      .populate("challenge", "title");
    if (!submission)
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });

    res.json({ success: true, data: submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
