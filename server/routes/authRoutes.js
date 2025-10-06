const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  signup,
  login,
  logout,
} = require("../Controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Route to send OTP to user's mobile number
router.post("/send-otp", sendOTP);

// Route to verify OTP entered by user
router.post("/verify-otp", verifyOTP);

// Route to register new user account
router.post("/signup", signup);

// Route to login existing user
router.post("/login", login);

// Route to logout user and invalidate token
router.post("/logout", protect, logout);

module.exports = router;
