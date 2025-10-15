import React, { useState } from "react";
import UserNavbar from "../../components/user/common/UserNavbar";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";

const ForgetPass = () => {
  const [tel, setTel] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const handleSent = (e) => {
    e.preventDefault();
    alert("Otp Sent to your Register Phone Number");
  };

  const handleOtp = (e) => {
    e.preventDefault();
    alert("otp verified successfully");
    navigate("/");
  };
  const inputClasses =
    "w-full rounded-lg border border-[#DCECE9] bg-white px-4 py-2 text-slate-700 placeholder:text-slate-400 focus:border-[#b8985b] focus:outline-none focus:ring-2 focus:ring-[#b8985b]/30";

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
              onChange={(e) => setTel(e.target.value)}
              required={true}
              className={inputClasses}
            />
            <div className="text-right text-sm">
              <button
                type="button"
                disabled={tel.length <= 0}
                className={`font-semibold text-[#b8985b] transition ${
                  tel.length <= 0
                    ? "cursor-not-allowed opacity-40"
                    : "hover:text-[#a9894f]"
                }`}
                onClick={handleSent}
              >
                Send reset OTP
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter the verification code"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value)}
              required={true}
              className={inputClasses}
            />
            <Button
              onClick={handleOtp}
              disabled={otp.length < 6}
              className="mt-2 w-full"
            >
              Verify code
            </Button>
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
    </div>
  );
};

export default ForgetPass;
