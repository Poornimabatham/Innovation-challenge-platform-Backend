const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
  publishChallenge,
  archiveChallenge,
  cloneChallenge,
} = require("../controllers/challengeController");

router.get("/", getChallenges);
router.get("/:id", getChallengeById);
router.post("/", protect, authorize("organizer", "admin"), createChallenge);
router.put("/:id", protect, authorize("organizer", "admin"), updateChallenge);
router.delete(
  "/:id",
  protect,
  authorize("organizer", "admin"),
  deleteChallenge,
);
router.patch(
  "/:id/publish",
  protect,
  authorize("organizer", "admin"),
  publishChallenge,
);
router.patch(
  "/:id/archive",
  protect,
  authorize("organizer", "admin"),
  archiveChallenge,
);
router.post(
  "/:id/clone",
  protect,
  authorize("organizer", "admin"),
  cloneChallenge,
);

module.exports = router;
