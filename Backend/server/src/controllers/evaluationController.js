const Evaluation = require("../models/Evaluation");
const Submission = require("../models/Submission");

exports.submitEvaluation = async (req, res) => {
  try {
    const { submission, challenge, rubric, feedback } = req.body;

    const existing = await Evaluation.findOne({
      submission,
      judge: req.user._id,
    });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Already evaluated this submission" });

    const totalScore = Object.values(rubric).reduce((a, b) => a + Number(b), 0);

    const evaluation = await Evaluation.create({
      submission,
      challenge,
      judge: req.user._id,
      rubric,
      totalScore,
      feedback,
    });

    res.status(201).json({ success: true, data: evaluation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateEvaluation = async (req, res) => {
  try {
    const { rubric, feedback } = req.body;
    const totalScore = Object.values(rubric).reduce((a, b) => a + Number(b), 0);

    const evaluation = await Evaluation.findByIdAndUpdate(
      req.params.id,
      { rubric, totalScore, feedback },
      { new: true },
    );
    res.json({ success: true, data: evaluation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ judge: req.user._id })
      .populate("submission")
      .populate("challenge", "title");
    res.json({ success: true, data: evaluations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSubmissionsToJudge = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("team", "name")
      .populate("challenge", "title")
      .populate("submittedBy", "name");

    const evaluated = await Evaluation.find({ judge: req.user._id }).select(
      "submission",
    );
    const evaluatedIds = evaluated.map((e) => e.submission.toString());

    const pending = submissions.filter(
      (s) => !evaluatedIds.includes(s._id.toString()),
    );
    const done = submissions.filter((s) =>
      evaluatedIds.includes(s._id.toString()),
    );

    res.json({ success: true, data: { pending, done } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
