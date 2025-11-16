import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserNavbar from "../../components/user/common/UserNavbar";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader.jsx";
import Skeleton from "../../components/common/Skeleton.jsx";
import { sendOtp, verifyOtp } from "../../api/auth";
import { ApiError } from "../../api/client";

const sanitizePhone = (value = "") => value.replace(/[^0-9]/g, "").slice(0, 10);
const sanitizeOtp = (value = "") => value.replace(/[^0-9]/g, "").slice(0, 6);

const ForgetPass = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tel, setTel] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const redirectTimeoutRef = useRef();

  const extractErrorMessage = (error, fallbackMessage) => {
    if (!error) {
      return fallbackMessage;
    }

    if (error instanceof ApiError && error.payload) {
      const payloadMessage =
        error.payload?.message ??
        error.payload?.error ??
        (Array.isArray(error.payload?.errors)
          ? error.payload.errors[0]?.message
          : null);

      if (payloadMessage) {
        return payloadMessage;
      }
    }

    if (typeof error?.message === "string" && error.message.length) {
      return error.message;
    }

    return fallbackMessage;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const phoneParam = sanitizePhone(urlParams.get("phone") ?? "");
    if (phoneParam) {
      setTel(phoneParam);
    }

    const timeoutId = window.setTimeout(() => setIsInitializing(false), 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [location.search]);

  useEffect(
    () => () => {
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
    },
    []
  );

  const handleSendResetOtp = async () => {
    const mobileNumber = sanitizePhone(tel);

    if (mobileNumber.length !== 10) {
      setStatus({
        type: "error",
        message: "Enter your 10-digit registered mobile number first.",
      });
      return;
    }

    setIsSendingOtp(true);
    setStatus(null);

    try {
      const response = await sendOtp({
        mobileNumber,
        context: "password_reset",
      });

      setIsOtpSent(true);
      setIsOtpVerified(false);
      setStatus({
        type: "info",
        message: `${response?.message ?? "Reset code sent successfully."}${
          response?.otp ? ` (Test code: ${response.otp})` : ""
        }`,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: extractErrorMessage(
          error,
          "We couldn't send a reset code right now. Please try again."
        ),
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!isOtpSent) {
      setStatus({
        type: "error",
        message: "Request a reset code before verifying.",
      });
      return;
    }

    const mobileNumber = sanitizePhone(tel);
    if (mobileNumber.length !== 10) {
      setStatus({
        type: "error",
        message: "Please re-enter the mobile number used to request the code.",
      });
      return;
    }

    const sanitizedOtp = sanitizeOtp(otp);
    if (sanitizedOtp.length !== 6) {
      setStatus({
        type: "error",
        message: "Enter the 6-digit code that was sent to your phone.",
      });
      return;
    }

    setIsVerifyingOtp(true);
    setStatus(null);

    try {
      await verifyOtp({ mobileNumber, otp: sanitizedOtp });
      setIsOtpVerified(true);
      setStatus({
        type: "success",
        message:
          "Code verified. You can now set a new password in the next step.",
      });

      redirectTimeoutRef.current = window.setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { showResetNotice: true },
        });
      }, 1400);
    } catch (error) {
      setStatus({
        type: "error",
        message: extractErrorMessage(
          error,
          "We couldn't verify that code. Please request a new one."
        ),
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const inputClasses =
    "w-full rounded-xl border-2 border-[#DCECE9] bg-white px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 transition-all duration-200 focus:border-[#b8985b] focus:outline-none focus:ring-4 focus:ring-[#b8985b]/20 hover:border-[#b8985b]/40";

  const showRefreshLoader = isSendingOtp || isVerifyingOtp;
  const loaderLabel = isVerifyingOtp
    ? "Verifying reset code"
    : "Sending reset code";

  const statusMessage = useMemo(() => {
    if (!status?.message) {
      return null;
    }

    const toneClasses =
      status.type === "error"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : status.type === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-blue-200 bg-blue-50 text-blue-700";

    const iconMap = {
      error: (
        <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      success: (
        <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      info: (
        <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
    };

    return (
      <div className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-sm font-medium ${toneClasses}`} style={{ animation: 'slide-in-from-top-2 0.3s ease-out' }}>
        {iconMap[status.type] || iconMap.info}
        <span className="flex-1">{status.message}</span>
      </div>
    );
  }, [status]);

  if (isInitializing) {
    return (
      <div>
        <UserNavbar />
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-br from-[#f5f2ee] via-[#faf8f5] to-[#f0ede8] px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-3xl border-2 border-[#DCECE9] bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-8">
            <div className="space-y-2 text-center">
              <Skeleton className="mx-auto h-8 w-56" />
              <Skeleton className="mx-auto h-4 w-72" />
            </div>
            <div className="mt-8 space-y-5">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={`reset-skeleton-field-${index}`}
                  className="space-y-2"
                >
                  <Skeleton className="h-4 w-36" />
                  <Skeleton
                    className="h-12 w-full rounded-xl"
                    rounded={false}
                  />
                </div>
              ))}
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-12 w-full rounded-full" rounded={false} />
            </div>
            <div className="mt-6 space-y-2 text-center">
              <Skeleton className="mx-auto h-3 w-56" />
              <Skeleton className="mx-auto h-3 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UserNavbar />
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-br from-[#f5f2ee] via-[#faf8f5] to-[#f0ede8] px-4 py-8 sm:px-6 lg:px-8">
        <form className="w-full max-w-md rounded-3xl border-2 border-[#DCECE9] bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-8 animate-slide-in-from-bottom-4">
          <div className="text-center">
            <h2 className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              Reset Your Password
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Enter your registered phone number to receive a reset code.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Phone Number
                <span className="ml-1 text-rose-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={tel}
                onChange={(event) => {
                  setTel(sanitizePhone(event.target.value));
                  if (status?.type === "error") {
                    setStatus(null);
                  }
                }}
                required
                className={inputClasses}
              />
            </div>
            <div className="text-right text-sm">
              <button
                type="button"
                disabled={tel.length !== 10 || isSendingOtp}
                className={`font-semibold text-[#b8985b] transition-all duration-200 hover:text-[#a9894f] hover:underline underline-offset-2 ${
                  tel.length !== 10 || isSendingOtp
                    ? "cursor-not-allowed opacity-40"
                    : ""
                }`}
                onClick={handleSendResetOtp}
              >
                {isSendingOtp
                  ? "Sending..."
                  : isOtpSent
                  ? "Resend code"
                  : "Send reset OTP"}
              </button>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Verification Code
                <span className="ml-1 text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter the verification code"
                  value={otp}
                  maxLength={6}
                  onChange={(event) => {
                    setOtp(sanitizeOtp(event.target.value));
                    if (status?.type === "error") {
                      setStatus(null);
                    }
                  }}
                  required
                  className={`${inputClasses} text-center text-lg tracking-widest font-semibold`}
                />
                {isOtpVerified && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={(event) => {
                event.preventDefault();
                handleVerifyOtp();
              }}
              disabled={otp.length < 6 || isVerifyingOtp}
              className="mt-2 w-full h-12 text-base font-semibold shadow-lg shadow-[#b8985b]/30 hover:shadow-xl hover:shadow-[#b8985b]/40 transition-all duration-200"
            >
              {isVerifyingOtp
                ? "Verifying..."
                : isOtpVerified
                ? "✓ Code verified"
                : "Verify code"}
            </Button>
            {statusMessage}
          </div>

          <div className="mt-6 text-right text-sm">
            <Link
              to="/login"
              className="font-semibold text-[#b8985b] transition-all duration-200 hover:text-[#a9894f] hover:underline underline-offset-2"
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>
      {showRefreshLoader ? (
        <div className="flex justify-center pb-12">
          <Loader label={loaderLabel} />
        </div>
      ) : null}
    </div>
  );
};

export default ForgetPass;
