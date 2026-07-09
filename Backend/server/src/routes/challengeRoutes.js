const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createChallenge, getChallenges, getChallengeById,
  updateChallenge, deleteChallenge, publishChallenge,
  archiveChallenge, cloneChallenge,
} = require("../controllers/challengeController");

const challengeValidation = {
  title:       { required: true, minLength: 3, maxLength: 100 },
  description: { required: true, minLength: 10 },
  deadline:    { required: true },
};

router.get("/", getChallenges);
router.get("/:id", getChallengeById);
router.post("/", protect, authorize("organizer", "admin"), validate(challengeValidation), createChallenge);
router.put("/:id", protect, authorize("organizer", "admin"), validate({ title: { minLength: 3, maxLength: 100 } }), updateChallenge);
router.delete("/:id", protect, authorize("organizer", "admin"), deleteChallenge);
router.patch("/:id/publish", protect, authorize("organizer", "admin"), publishChallenge);
router.patch("/:id/archive", protect, authorize("organizer", "admin"), archiveChallenge);
router.post("/:id/clone", protect, authorize("organizer", "admin"), cloneChallenge);

module.exports = router;
