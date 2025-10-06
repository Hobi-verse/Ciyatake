import { apiRequest, withApiFallback } from "./client";

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
