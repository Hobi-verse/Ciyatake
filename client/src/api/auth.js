import { apiRequest, withApiFallback } from "./client";

const createMockResponse = (data = {}) => ({
  success: true,
  ...data,
});

export const sendOtp = async ({ phoneNumber, context = "register" }) =>
  withApiFallback(
    () =>
      apiRequest("/auth/otp", {
        method: "POST",
        body: { phoneNumber, context },
      }),
    () =>
      Promise.resolve(
        createMockResponse({
          message: "OTP sent (mock)",
          otp: "123456",
        })
      )
  );

export const verifyOtp = async ({ phoneNumber, otp, context = "register" }) =>
  withApiFallback(
    () =>
      apiRequest("/auth/otp/verify", {
        method: "POST",
        body: { phoneNumber, otp, context },
      }),
    () =>
      Promise.resolve(
        createMockResponse({
          message: "OTP verified (mock)",
        })
      )
  );

export const registerUser = async (payload) =>
  withApiFallback(
    () =>
      apiRequest("/auth/register", {
        method: "POST",
        body: payload,
      }),
    () =>
      Promise.resolve(
        createMockResponse({
          message: "User registered (mock)",
          user: {
            id: "mock-user",
            phoneNumber: payload?.phoneNumber,
          },
        })
      )
  );

export const loginUser = async (payload) =>
  withApiFallback(
    () =>
      apiRequest("/auth/login", {
        method: "POST",
        body: payload,
      }),
    () =>
      Promise.resolve(
        createMockResponse({
          message: "Login successful (mock)",
          token: "mock-token",
        })
      )
  );

export const updatePassword = async (payload) =>
  withApiFallback(
    () =>
      apiRequest("/auth/password", {
        method: "PATCH",
        body: payload,
      }),
    () =>
      Promise.resolve(
        createMockResponse({
          message: "Password updated (mock)",
        })
      )
  );
