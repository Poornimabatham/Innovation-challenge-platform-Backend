const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  submitEvaluation,
  updateEvaluation,
  getEvaluations,
  getSubmissionsToJudge,
} = require("../controllers/evaluationController");

router.get("/", protect, authorize("judge", "admin"), getEvaluations);
router.get(
  "/submissions",
  protect,
  authorize("judge", "admin"),
  getSubmissionsToJudge,
);
router.post("/", protect, authorize("judge", "admin"), submitEvaluation);
router.put("/:id", protect, authorize("judge", "admin"), updateEvaluation);

module.exports = router;
