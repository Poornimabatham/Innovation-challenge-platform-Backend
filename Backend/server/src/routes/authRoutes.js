const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.post("/register", validate({
  name:     { required: true, minLength: 2, maxLength: 50 },
  email:    { required: true, isEmail: true },
  password: { required: true, minLength: 6 },
  role:     { isEnum: ["admin", "organizer", "judge", "student"] },
}), register);

router.post("/login", validate({
  email:    { required: true, isEmail: true },
  password: { required: true },
}), login);

router.get("/me", protect, getMe);

module.exports = router;
