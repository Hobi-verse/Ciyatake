const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: function() {
        return new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
      },
      required: true,
    },
    // Track if OTP has been used to prevent reuse
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, //Enables createdAt & updatedAt
  }
);

// TTL (15 mins = 900 seconds) based on createdAt
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

// Define a function to send the email
async function sendVerificationEmail(email, otp) {
  try {
    const subject = `Your OTP for ${process.env.APP_NAME || 'CiyaTake'} Account Verification`;
    const text = `Your OTP for account verification is: ${otp}

This OTP is valid for 15 minutes only.
Don't share this OTP with anyone.

If you didn't request this OTP, please ignore this email.

Best regards,
${process.env.APP_NAME || 'CiyaTake'} Team`;

    const mailResponse = await mailSender(email, subject, text);
    console.log("✅ Email sent successfully", mailResponse.response);
    return mailResponse;
  } catch (error) {
    console.error("❌ Error occurred while sending email:", error.message);
    throw error;
  }
}

// Define a pre-save hook to send email before the document is saved
OTPSchema.pre("save", async function (next) {
  try {
    // Only send email for new documents (not updates)
    if (this.isNew) {
      await sendVerificationEmail(this.email, this.otp);
      console.log(`✅ OTP email sent successfully for: ${this.email}`);
    }
  } catch (error) {
    console.error("❌ Error sending verification email:", error.message);
    
    // In development, show fallback OTP and continue
    if (process.env.NODE_ENV !== "production") {
      console.log(`🔐 FALLBACK OTP for ${this.email}: ${this.otp}`);
    } else {
      // In production, log error but continue with save to prevent 500 errors
      console.error(`❌ Production email failure for ${this.email}:`, {
        error: error.message,
        otp: this.otp,
        timestamp: new Date().toISOString()
      });
    }
  }
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
