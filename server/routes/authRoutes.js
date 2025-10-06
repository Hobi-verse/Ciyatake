const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  signup,
  login,
} = require("../Controllers/authController");

// Route to send OTP to user's mobile number
router.post("/send-otp", sendOTP);

// Route to verify OTP entered by user
router.post("/verify-otp", verifyOTP);

// Route to register new user account
router.post("/signup", signup);

// Route to login existing user
router.post("/login", login);

module.exports = router;
