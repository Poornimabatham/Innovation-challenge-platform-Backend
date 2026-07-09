const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createTeam, getTeams, getMyTeams,
  joinTeam, leaveTeam, deleteTeam,
} = require("../controllers/teamController");

router.get("/", protect, getTeams);
router.get("/my", protect, getMyTeams);

router.post("/", protect, validate({
  name:      { required: true, minLength: 2, maxLength: 50 },
  challenge: { required: true },
}), createTeam);

router.post("/join", protect, validate({
  inviteCode: { required: true, minLength: 6 },
}), joinTeam);

router.delete("/:id/leave", protect, leaveTeam);
router.delete("/:id", protect, deleteTeam);

module.exports = router;
