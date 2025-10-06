const mongoose = require("mongoose");

// Define the user schema for storing user account information
const userSchema = new mongoose.Schema(
  {
    // User's mobile number for login and OTP verification
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    
    // Secure password storage (will be hashed before saving)
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    
    // User's full name for personalization
    fullName: {
      type: String,
      trim: true,
      default: "",
    },
    
    // Email address for communication (optional)
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      default: "",
    },
    
    // User role for access control (customer, admin, etc.)
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    
    // Track if mobile number is verified via OTP
    isVerified: {
      type: Boolean,
      default: false,
    },
    
    // Store user's shipping addresses
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: "India" },
        isDefault: { type: Boolean, default: false },
      },
    ],
    
    // Track account status for security purposes
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create and export the User model
module.exports = mongoose.model("User", userSchema);
