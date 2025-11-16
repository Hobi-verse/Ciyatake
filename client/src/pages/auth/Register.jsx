import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/user/common/UserNavbar";
import AuthForm from "../../components/common/AuthForm";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader.jsx";
import {
  sendOtp,
  verifyOtp,
  registerUser,
  googleLogin,
  getUserProfile,
} from "../../api/auth";
import { storeAuthSession, clearAuthSession } from "../../utils/authStorage";

const OTP_LENGTH = 6;

const Register = () => {
  const navigate = useNavigate();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpFeedback, setOtpFeedback] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

  const extractErrorMessage = useCallback(
    (error, fallback = "Something went wrong. Please try again.") => {
      if (!error) {
        return fallback;
      }

      const payload = error.payload ?? error.response ?? null;

      if (payload) {
        if (typeof payload === "string" && payload.length) {
          return payload;
        }
        if (typeof payload.message === "string" && payload.message.length) {
          return payload.message;
        }
      }

      if (typeof error.message === "string" && error.message.length) {
        return error.message;
      }

      return fallback;
    },
    []
  );

  const handleSendOtp = useCallback(
    async (email, resetOtp) => {
      const sanitized = (email ?? "").trim();

      if (!sanitized || !/^\S+@\S+\.\S+$/.test(sanitized)) {
        setOtpFeedback({
          type: "error",
          message: "Enter a valid email address before requesting an OTP.",
        });
        return;
      }

      setIsSendingOtp(true);
      setOtpFeedback(null);
      setStatus(null);

      try {
        const response = await sendOtp({
          email: sanitized,
          context: "register",
        });

        setIsOtpSent(true);
        setIsOtpVerified(false);
        setOtpEmail(sanitized);
        resetOtp?.();

        setOtpFeedback({
          type: "info",
          message: response?.message ?? "OTP sent successfully to your email address.",
        });
      } catch (error) {
        setOtpFeedback({
          type: "error",
          message: extractErrorMessage(
            error,
            "Failed to send OTP. Please try again."
          ),
        });
      } finally {
        setIsSendingOtp(false);
      }
    },
    [extractErrorMessage]
  );

  const handleVerifyOtp = useCallback(
    async (email, enteredOtp) => {
      if (!isOtpSent) {
        setOtpFeedback({
          type: "error",
          message: "Request an OTP before attempting verification.",
        });
        return;
      }

      const sanitizedEmail = (email ?? "").trim();

      if (!sanitizedEmail || !/^\S+@\S+\.\S+$/.test(sanitizedEmail)) {
        setOtpFeedback({
          type: "error",
          message: "Enter the email address used to request the OTP.",
        });
        return;
      }

      if (otpEmail && sanitizedEmail !== otpEmail) {
        setOtpFeedback({
          type: "error",
          message:
            "Email address changed. Please request a new OTP for this email.",
        });
        setIsOtpVerified(false);
        return;
      }

      const sanitizedOtp = (enteredOtp ?? "")
        .replace(/[^0-9]/g, "")
        .slice(0, OTP_LENGTH);

      if (!sanitizedOtp || sanitizedOtp.length !== OTP_LENGTH) {
        setOtpFeedback({
          type: "error",
          message: "Enter the 6-digit OTP that was sent to your email address.",
        });
        return;
      }

      setIsVerifyingOtp(true);
      setOtpFeedback(null);
      setStatus(null);

      try {
        const response = await verifyOtp({
          email: sanitizedEmail,
          otp: sanitizedOtp,
        });

        setIsOtpVerified(true);
        setOtpFeedback({
          type: "success",
          message:
            response?.message ??
            "OTP verified successfully. You can now create your password.",
        });
      } catch (error) {
        setIsOtpVerified(false);
        setOtpFeedback({
          type: "error",
          message: extractErrorMessage(
            error,
            "Failed to verify OTP. Please try again."
          ),
        });
      } finally {
        setIsVerifyingOtp(false);
      }
    },
    [extractErrorMessage, isOtpSent, otpEmail]
  );

  const buttonLabel = isSubmitting ? "Creating account..." : "Register";

  const fields = [
    {
      name: "email",
      render: ({
        value = "",
        setValue,
        formData,
        setFieldValue,
        inputClasses,
      }) => {
        const emailId = "register-email-input";
        const otpId = "register-otp-input";

        const handleEmailChange = (event) => {
          const nextValue = event.target.value.trim();
          setValue(nextValue);

          setStatus(null);

          if (isOtpSent || isOtpVerified) {
            if (nextValue !== otpEmail) {
              setIsOtpSent(false);
              setIsOtpVerified(false);
              setOtpEmail("");
              setFieldValue("otp", "");
            }
          }

          if (otpFeedback) {
            setOtpFeedback(null);
          }
        };

        const handleOtpChange = (event) => {
          const nextValue = event.target.value
            .replace(/[^0-9]/g, "")
            .slice(0, OTP_LENGTH);
          setFieldValue("otp", nextValue);
          setOtpFeedback(null);
          if (isOtpVerified) {
            setIsOtpVerified(false);
          }
        };

        return (
          <div className="space-y-3">
            <label
              htmlFor={emailId}
              className="block text-sm font-semibold text-slate-700"
            >
              Email address & OTP
              <span className="ml-1 text-rose-500">*</span>
            </label>
            <div className="grid gap-4 sm:grid-cols-[1.6fr_1fr]">
              <div className="space-y-3">
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={inputClasses}
                  placeholder="Enter your email address"
                  value={value}
                  onChange={handleEmailChange}
                  required
                />
                <Button
                  type="button"
                  className="w-full h-11 disabled:opacity-60 shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() =>
                    handleSendOtp(value, () => setFieldValue("otp", ""))
                  }
                  disabled={!/^\S+@\S+\.\S+$/.test(value) || isSendingOtp}
                >
                  {isSendingOtp
                    ? "Sending..."
                    : isOtpSent
                    ? "Resend OTP"
                    : "Send OTP"}
                </Button>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    id={otpId}
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className={`${inputClasses} text-center text-lg tracking-widest font-semibold disabled:opacity-60`}
                    placeholder="000000"
                    value={formData.otp ?? ""}
                    onChange={handleOtpChange}
                    disabled={!isOtpSent}
                    maxLength={OTP_LENGTH}
                  />
                  {isOtpVerified && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 border-2 border-[#b8985b] bg-white text-[#b8985b] hover:bg-[#b8985b]/10 disabled:border-[#DCECE9] disabled:text-slate-400 disabled:opacity-60 transition-all duration-200"
                  onClick={() => handleVerifyOtp(value, formData.otp ?? "")}
                  disabled={
                    !isOtpSent ||
                    (formData.otp ?? "").length !== OTP_LENGTH ||
                    isVerifyingOtp ||
                    isOtpVerified
                  }
                >
                  {isVerifyingOtp
                    ? "Verifying..."
                    : isOtpVerified
                    ? "✓ Verified"
                    : "Verify OTP"}
                </Button>
              </div>
            </div>
            {otpFeedback ? (
              <div className={`flex items-start gap-2 rounded-xl p-3 text-sm font-medium ${
                otpFeedback.type === "error"
                  ? "bg-rose-50 text-rose-700"
                  : otpFeedback.type === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-blue-50 text-blue-700"
              }`} style={{ animation: 'slide-in-from-top-2 0.3s ease-out' }}>
                {otpFeedback.type === "error" && (
                  <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {otpFeedback.type === "success" && (
                  <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {otpFeedback.type === "info" && (
                  <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="flex-1">{otpFeedback.message}</span>
              </div>
            ) : null}
          </div>
        );
      },
    },
    {
      name: "fullName",
      label: "Full name",
      type: "text",
      placeholder: "Enter your full name",
      required: false,
      disabled: !isOtpVerified,
      autoComplete: "name",
    },
    {
      name: "password",
      label: "Create password",
      type: "password",
      placeholder: "Create a password",
      required: true,
      disabled: !isOtpVerified,
      autoComplete: "new-password",
      inputClassName: "pr-24",
    },
    {
      name: "confirmPassword",
      label: "Confirm password",
      type: "password",
      placeholder: "Re-enter the password",
      required: true,
      disabled: !isOtpVerified,
      autoComplete: "new-password",
      inputClassName: "pr-24",
    },
    {
      name: "otp",
      hidden: true,
      defaultValue: "",
    },
  ];

  const socialProviders = [
    {
      label: "Google",
      onClick: () => {
        setStatus({
          type: "info",
          message: "Redirecting to Google for authentication...",
        });
        googleLogin();
      },
    },
  ];

  // Handle Google OAuth callback token (same behavior as login flow)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    let cleanupTimeout;

    if (token) {
      setIsProcessingOAuth(true);
      (async () => {
        try {
          setStatus({ type: "info", message: "Finishing Google signup..." });

          // Store token so api client can use it for authenticated requests
          storeAuthSession({ token });

          // Try to fetch profile
          let profileResponse = null;
          try {
            profileResponse = await getUserProfile();
          } catch (profileErr) {
            // profile fetch failed; continue with minimal session
            console.warn(
              "Failed to fetch profile after Google signup:",
              profileErr
            );
          }

          if (profileResponse?.success && profileResponse?.user) {
            storeAuthSession({ token, user: profileResponse.user });
            const redirectPath =
              profileResponse.user.role === "admin" ? "/admin/dashboard" : "/";
            setStatus({
              type: "success",
              message: "Signup successful. Redirecting...",
            });
            cleanupTimeout = window.setTimeout(() => {
              setIsProcessingOAuth(false);
              navigate(redirectPath, { replace: true });
            }, 600);
            return;
          }

          // If we couldn't fetch full profile, still store token and send user home
          storeAuthSession({ token, user: { id: "google-user" } });
          setStatus({
            type: "success",
            message: "Signup successful. Redirecting...",
          });
          cleanupTimeout = window.setTimeout(() => {
            setIsProcessingOAuth(false);
            navigate("/", { replace: true });
          }, 600);
        } catch (e) {
          console.error("Error handling Google signup callback:", e);
          setStatus({
            type: "error",
            message: "Google signup failed. Please try again.",
          });
          clearAuthSession();
          setIsProcessingOAuth(false);
        }
      })();
    }

    if (error) {
      setIsProcessingOAuth(true);
      const errorMessages = {
        google_auth_failed: "Google authentication failed. Please try again.",
        google_auth_error: "An error occurred during Google authentication.",
      };
      const message =
        errorMessages[error] || "Authentication failed. Please try again.";
      setStatus({ type: "error", message });

      // optionally clean URL
      cleanupTimeout = window.setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete("error");
        window.history.replaceState(
          {},
          document.title,
          url.pathname + url.search
        );
        setIsProcessingOAuth(false);
      }, 2500);
    }
    return () => {
      if (cleanupTimeout) {
        window.clearTimeout(cleanupTimeout);
      }
    };
  }, [navigate]);

  const handleSubmit = useCallback(
    async (formValues, { reset }) => {
      if (!isOtpVerified) {
        setOtpFeedback({
          type: "error",
          message: "Please verify the OTP before creating your account.",
        });
        return;
      }

      const email = (formValues.email ?? "").trim();

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        setOtpFeedback({
          type: "error",
          message: "Enter the email address you verified with OTP.",
        });
        return;
      }

      if (otpEmail && otpEmail !== email) {
        setOtpFeedback({
          type: "error",
          message:
            "Email address no longer matches the verified OTP. Please request a new OTP.",
        });
        setIsOtpVerified(false);
        return;
      }

      if (formValues.password !== formValues.confirmPassword) {
        setOtpFeedback({
          type: "error",
          message: "Passwords do not match. Please re-enter them.",
        });
        return;
      }

      setIsSubmitting(true);
      setStatus(null);

      try {
        const response = await registerUser({
          email,
          password: formValues.password,
          confirmPassword: formValues.confirmPassword,
          fullName: formValues.fullName || "",
        });

        if (!response?.success) {
          throw new Error(response?.message ?? "Failed to create account");
        }

        storeAuthSession({ token: response.token, user: response.user });

        setStatus({
          type: "success",
          message:
            response?.message ??
            "Account created successfully! Redirecting to home...",
        });

        reset?.();
        setIsOtpSent(false);
        setIsOtpVerified(false);
        setOtpEmail("");
        setOtpFeedback(null);

        setTimeout(() => navigate("/"), 700);
      } catch (error) {
        setStatus({
          type: "error",
          message: extractErrorMessage(
            error,
            "Failed to create account. Please try again."
          ),
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [extractErrorMessage, isOtpVerified, navigate, otpEmail]
  );

  const showRefreshLoader =
    !isProcessingOAuth && (isSendingOtp || isVerifyingOtp || isSubmitting);

  let loaderLabel = "";
  if (isSubmitting) {
    loaderLabel = "Creating your account";
  } else if (isVerifyingOtp) {
    loaderLabel = "Verifying OTP";
  } else if (isSendingOtp) {
    loaderLabel = "Sending OTP";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f2ee] via-[#faf8f5] to-[#f0ede8]">
      <UserNavbar />
      <AuthForm
        title="Create New Account"
        subtitle="Start your personalised shopping experience"
        fields={fields}
        onSubmit={handleSubmit}
        onFieldChange={() => {
          if (status?.type === "error") {
            setStatus(null);
          }
        }}
        socialProviders={socialProviders}
        buttonLabel={buttonLabel}
        isSubmitDisabled={!isOtpVerified || isSubmitting || isProcessingOAuth}
        footerText="Already have an account?"
        footerLinkText="Login"
        footerLinkHref="/login"
        status={status}
        loading={isProcessingOAuth}
      />
      {showRefreshLoader ? (
        <div className="flex justify-center pt-6 pb-8">
          <Loader label={loaderLabel} />
        </div>
      ) : null}
    </div>
  );
};

export default Register;
