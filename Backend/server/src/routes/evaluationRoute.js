const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  submitEvaluation, updateEvaluation,
  getEvaluations, getSubmissionsToJudge,
} = require("../controllers/evaluationController");

router.get("/", protect, authorize("judge", "admin"), getEvaluations);
router.get("/submissions", protect, authorize("judge", "admin"), getSubmissionsToJudge);

router.post("/", protect, authorize("judge", "admin"), validate({
  submission: { required: true },
  challenge:  { required: true },
  rubric:     { required: true },
}), submitEvaluation);

router.put("/:id", protect, authorize("judge", "admin"), validate({
  rubric: { required: true },
}), updateEvaluation);

module.exports = router;
