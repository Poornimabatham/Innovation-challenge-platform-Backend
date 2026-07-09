const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createSubmission, updateSubmission, lockSubmission,
  getSubmissions, getMySubmissions, getSubmissionById,
} = require("../controllers/submissionController");

router.get("/", protect, authorize("admin", "judge", "organizer"), getSubmissions);
router.get("/my", protect, getMySubmissions);
router.get("/:id", protect, getSubmissionById);

router.post("/", protect, validate({
  team:      { required: true },
  challenge: { required: true },
  githubLink: { isUrl: true },
  pdfUrl:     { isUrl: true },
  videoUrl:   { isUrl: true },
}), createSubmission);

router.put("/:id", protect, validate({
  githubLink: { isUrl: true },
  pdfUrl:     { isUrl: true },
  videoUrl:   { isUrl: true },
}), updateSubmission);

router.patch("/:id/lock", protect, lockSubmission);

module.exports = router;
