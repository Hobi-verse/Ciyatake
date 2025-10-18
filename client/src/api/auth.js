import { apiRequest } from "./client";
import { API_BASE_URL } from "./config";
import { storeAuthSession } from "../utils/authStorage";

const normalizeEmailPayload = (payload = {}) => {
  const { email, phoneNumber, mobileNumber, ...rest } = payload ?? {};
  return {
    ...rest,
    email: email ?? "",
    mobileNumber: mobileNumber ?? phoneNumber ?? "",
  };
};

export const sendOtp = async ({ email, context = "register" } = {}) =>
  apiRequest("/v1/auth/send-otp", {
    method: "POST",
    body: { email, context },
  });

export const verifyOtp = async ({ email, otp } = {}) =>
  apiRequest("/v1/auth/verify-otp", {
    method: "POST",
    body: { email, otp },
  });

export const registerUser = async (payload = {}) =>
  apiRequest("/v1/auth/signup", {
    method: "POST",
    body: normalizeEmailPayload(payload),
  });

export const loginUser = async (payload = {}) =>
  apiRequest("/v1/auth/login", {
    method: "POST",
    body: normalizeEmailPayload(payload),
  });

export const updatePassword = async (payload = {}) =>
  apiRequest("/v1/auth/password", {
    method: "PATCH",
    body: normalizeEmailPayload(payload),
  });

export const logoutUser = async () =>
  apiRequest("/v1/auth/logout", {
    method: "POST",
  });

// Google OAuth Login
export const googleLogin = () => {
  // Redirect to backend Google OAuth endpoint
  window.location.href = `${API_BASE_URL}/v1/auth/google`;
};

// Get user profile
export const getUserProfile = async () =>
  apiRequest("/v1/auth/profile", {
    method: "GET",
  });

// Link mobile number to Google account
export const linkMobileNumber = async ({ phoneNumber, mobileNumber, otp } = {}) =>
  apiRequest("/v1/auth/link-mobile", {
    method: "POST",
    body: { phoneNumber, mobileNumber, otp },
  });

// Handle Google OAuth success callback
export const handleGoogleSuccess = (token) => {
  // Store token in localStorage
  if (token) {
    storeAuthSession({ token });
    // You can also set it in your auth context/state management
    return true;
  }
  return false;
};
