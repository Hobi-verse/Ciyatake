const mongoose = require("mongoose");
const { sendOTPEmail } = require("../utils/emailService");

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

// Function to send verification email
async function sendVerificationEmail(email, otp) {
  try {
    console.log(`📧 Sending OTP email to: ${email.replace(/(.{3}).*(@.*)/, '$1***$2')}`);
    
    const mailResponse = await sendOTPEmail(email, otp);
    
    console.log("✅ OTP email sent successfully:", mailResponse.messageId);
    return mailResponse;
  } catch (error) {
    console.error("❌ Error occurred while sending OTP email:", error.message);
    
    // In production, you might want to log this to a monitoring service
    if (process.env.NODE_ENV === 'production') {
      console.error(`❌ Production OTP email failure for ${email}:`, {
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
    
    throw error;
  }
}

// Pre-save hook to automatically send email when OTP document is created
otpSchema.pre("save", async function(next) {
  try {
    // Only send email for new documents (not updates)
    if (this.isNew) {
      await sendVerificationEmail(this.email, this.otp);
    }
    next();
  } catch (error) {
    console.error("❌ Pre-save hook error:", error.message);
    
    // In development, show fallback OTP
    if (process.env.NODE_ENV !== "production") {
      console.log(`🔐 FALLBACK OTP for ${this.email}: ${this.otp}`);
      // Continue with save even if email fails in development
      next();
    } else {
      // In production, fail the save operation if email fails
      next(error);
    }
  }
});

// Automatically delete OTP document after expiration
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OTP", otpSchema);
