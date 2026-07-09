const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  createSubmission,
  updateSubmission,
  lockSubmission,
  getSubmissions,
  getMySubmissions,
  getSubmissionById,
} = require("../controllers/submissionController");

router.get(
  "/",
  protect,
  authorize("admin", "judge", "organizer"),
  getSubmissions,
);
router.get("/my", protect, getMySubmissions);
router.get("/:id", protect, getSubmissionById);
router.post("/", protect, createSubmission);
router.put("/:id", protect, updateSubmission);
router.patch("/:id/lock", protect, lockSubmission);

module.exports = router;
