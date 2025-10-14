import { apiRequest, withApiFallback } from "./client";
import { API_BASE_URL } from "./config";

const createMockResponse = (data = {}) => ({
  success: true,
  ...data,
});

const normalizeMobilePayload = (payload = {}) => {
  const { phoneNumber, mobileNumber, ...rest } = payload ?? {};
  return {
    ...rest,
    mobileNumber: mobileNumber ?? phoneNumber ?? "",
  };
};

export const sendOtp = async ({ phoneNumber, mobileNumber, context = "register" } = {}) =>
  withApiFallback(
    () =>
      apiRequest("/v1/auth/send-otp", {
        method: "POST",
        body: normalizeMobilePayload({ phoneNumber, mobileNumber, context }),
      }),
    () =>
      Promise.resolve(
        createMockResponse({
          message: "OTP sent (mock)",
          otp: "123456",
        })
      )
  );

export const verifyOtp = async ({ phoneNumber, mobileNumber, otp } = {}) =>
  withApiFallback(
    () =>
      apiRequest("/v1/auth/verify-otp", {
        method: "POST",
        body: normalizeMobilePayload({ phoneNumber, mobileNumber, otp }),
      }),
    () =>
      Promise.resolve(
        createMockResponse({
          message: "OTP verified (mock)",
        })
      )
  );

export const registerUser = async (payload = {}) =>
  withApiFallback(
    () =>
      apiRequest("/v1/auth/signup", {
        method: "POST",
        body: normalizeMobilePayload(payload),
      }),
    () =>
      Promise.resolve(
        createMockResponse({
          message: "User registered (mock)",
          user: {
            id: "mock-user",
            mobileNumber: payload?.phoneNumber ?? payload?.mobileNumber,
          },
          token: "mock-token",
        })
      )
  );

export const loginUser = async (payload = {}) =>
  withApiFallback(
    () =>
      apiRequest("/v1/auth/login", {
        method: "POST",
        body: normalizeMobilePayload(payload),
      }),
    () =>
      Promise.resolve(
        createMockResponse({
          message: "Login successful (mock)",
          token: "mock-token",
          user: {
            id: "mock-user",
            mobileNumber: payload?.phoneNumber ?? payload?.mobileNumber,
          },
        })
      )
  );

export const updatePassword = async (payload = {}) =>
  withApiFallback(
    () =>
      apiRequest("/v1/auth/password", {
        method: "PATCH",
        body: normalizeMobilePayload(payload),
      }),
    () =>
      Promise.resolve(
        createMockResponse({
          message: "Password updated (mock)",
        })
      )
  );

export const logoutUser = async () =>
  withApiFallback(
    () =>
      apiRequest("/v1/auth/logout", {
        method: "POST",
      }),
    () =>
      Promise.resolve(
        createMockResponse({
          message: "Logout successful (mock)",
        })
      )
  );

// Google OAuth Login
export const googleLogin = () => {
  // Redirect to backend Google OAuth endpoint
  window.location.href = `${API_BASE_URL}/v1/auth/google`;
};

// Get user profile
export const getUserProfile = async () =>
  withApiFallback(
    () =>
      apiRequest("/v1/auth/profile", {
        method: "GET",
      }),
    () =>
      Promise.resolve(
        createMockResponse({
          user: {
            id: "mock-user",
            fullName: "Mock User",
            email: "mock@example.com",
            profilePicture: "",
          },
        })
      )
  );

// Link mobile number to Google account
export const linkMobileNumber = async ({ phoneNumber, mobileNumber, otp } = {}) =>
  withApiFallback(
    () =>
      apiRequest("/v1/auth/link-mobile", {
        method: "POST",
        body: normalizeMobilePayload({ phoneNumber, mobileNumber, otp }),
      }),
    () =>
      Promise.resolve(
        createMockResponse({
          message: "Mobile number linked successfully (mock)",
        })
      )
  );

// Handle Google OAuth success callback
export const handleGoogleSuccess = (token) => {
  // Store token in localStorage
  if (token) {
    localStorage.setItem("authToken", token);
    // You can also set it in your auth context/state management
    return true;
  }
  return false;
};
