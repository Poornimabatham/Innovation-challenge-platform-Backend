const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createTeam,
  getTeams,
  getMyTeams,
  joinTeam,
  leaveTeam,
  deleteTeam,
} = require("../controllers/teamController");

router.get("/", protect, getTeams);
router.get("/my", protect, getMyTeams);
router.post("/", protect, createTeam);
router.post("/join", protect, joinTeam);
router.delete("/:id/leave", protect, leaveTeam);
router.delete("/:id", protect, deleteTeam);

module.exports = router;
