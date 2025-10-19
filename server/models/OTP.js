const mongoose = require("mongoose");

// Define OTP schema for storing verification codes
const otpSchema = new mongoose.Schema(
  {
    // Email address for which OTP is generated
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    
    // 6-digit OTP code sent to user
    otp: {
      type: String,
      required: true,
    },
    
    // OTP expiration time (valid for 10 minutes)
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    },
    
    // Track if OTP has been used to prevent reuse
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically delete OTP document after expiration
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OTP", otpSchema);
