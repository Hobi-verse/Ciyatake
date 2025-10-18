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
          <div className="space-y-2">
            <label
              htmlFor={emailId}
              className="block text-sm font-medium text-slate-700"
            >
              Email address & OTP
            </label>
            <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr]">
              <div className="space-y-2">
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
                  className="w-full disabled:opacity-60"
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
              <div className="space-y-2">
                <input
                  id={otpId}
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className={`${inputClasses} disabled:opacity-60`}
                  placeholder="Enter OTP"
                  value={formData.otp ?? ""}
                  onChange={handleOtpChange}
                  disabled={!isOtpSent}
                  maxLength={OTP_LENGTH}
                />
                <Button
                  type="button"
                  className="w-full border border-[#b8985b] bg-white text-[#b8985b] hover:bg-[#F2EAE0] disabled:border-[#DCECE9] disabled:text-slate-400 disabled:opacity-60"
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
                    ? "OTP Verified"
                    : "Verify OTP"}
                </Button>
              </div>
            </div>
            {otpFeedback ? (
              <p
                className={`text-sm ${
                  otpFeedback.type === "error"
                    ? "text-rose-600"
                    : otpFeedback.type === "success"
                    ? "text-teal-600"
                    : "text-slate-500"
                }`}
              >
                {otpFeedback.message}
              </p>
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
    <div className="min-h-screen bg-[#f5f2ee]">
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
        <div className="flex justify-center pt-6">
          <Loader label={loaderLabel} />
        </div>
      ) : null}
    </div>
  );
};

export default Register;
