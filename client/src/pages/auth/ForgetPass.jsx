import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    "w-full rounded-lg border border-[#DCECE9] bg-white px-4 py-2 text-slate-700 placeholder:text-slate-400 focus:border-[#b8985b] focus:outline-none focus:ring-2 focus:ring-[#b8985b]/30";

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
        ? "border-rose-200 bg-rose-50 text-rose-600"
        : status.type === "success"
        ? "border-[#c3dedd] bg-[#c3dedd]/20 text-[#2f4a55]"
        : "border-[#DCECE9] bg-[#F2EAE0] text-slate-600";

    return (
      <div className={`rounded-lg border px-3 py-2 text-sm ${toneClasses}`}>
        {status.message}
      </div>
    );
  }, [status]);

  if (isInitializing) {
    return (
      <div>
        <UserNavbar />
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#f5f2ee] px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#DCECE9] bg-white/95 p-8 shadow-[0_36px_80px_rgba(15,23,42,0.14)]">
            <div className="space-y-2 text-center">
              <Skeleton className="mx-auto h-8 w-56" />
              <Skeleton className="mx-auto h-4 w-72" />
            </div>
            <div className="mt-6 space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={`reset-skeleton-field-${index}`}
                  className="space-y-2"
                >
                  <Skeleton className="h-4 w-36" />
                  <Skeleton
                    className="h-11 w-full rounded-lg"
                    rounded={false}
                  />
                </div>
              ))}
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-11 w-full rounded-full" rounded={false} />
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
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#f5f2ee] px-4">
        <form className="w-full max-w-md rounded-2xl border border-[#DCECE9] bg-white/95 p-8 shadow-[0_36px_80px_rgba(15,23,42,0.14)]">
          <h2 className="text-center text-2xl font-semibold text-slate-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Enter your registered phone number to receive a reset code.
          </p>

          <div className="mt-6 space-y-4">
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
            <div className="text-right text-sm">
              <button
                type="button"
                disabled={tel.length !== 10 || isSendingOtp}
                className={`font-semibold text-[#b8985b] transition ${
                  tel.length !== 10 || isSendingOtp
                    ? "cursor-not-allowed opacity-40"
                    : "hover:text-[#a9894f]"
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
              className={inputClasses}
            />
            <Button
              onClick={(event) => {
                event.preventDefault();
                handleVerifyOtp();
              }}
              disabled={otp.length < 6 || isVerifyingOtp}
              className="mt-2 w-full"
            >
              {isVerifyingOtp
                ? "Verifying..."
                : isOtpVerified
                ? "Code verified"
                : "Verify code"}
            </Button>
            {statusMessage}
          </div>

          <div className="mt-6 text-right text-sm">
            <a
              href="/login"
              className="font-semibold text-[#b8985b] transition hover:text-[#a9894f]"
            >
              Back to login
            </a>
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
