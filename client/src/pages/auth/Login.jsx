import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/common/AuthForm";
import UserNavbar from "../../components/user/common/UserNavbar";
import { loginUser, googleLogin } from "../../api/auth";
import { storeAuthSession } from "../../utils/authStorage";

const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const buttonLabel = useMemo(
    () => (isSubmitting ? "Signing in..." : "Sign In"),
    [isSubmitting]
  );

  // Handle Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (token) {
      // Handle successful Google login
      setStatus({
        type: "success",
        message: "Google login successful! Redirecting...",
      });

      // Store the token
      localStorage.setItem("authToken", token);

      // You may want to get user info here
      // For now, redirect to home page
      setTimeout(() => {
        navigate("/", { replace: true });
        // Clean up URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }, 1000);
    }

    if (error) {
      // Handle Google login error
      const errorMessages = {
        google_auth_failed: "Google authentication failed. Please try again.",
        google_auth_error: "An error occurred during Google authentication.",
      };

      const message =
        errorMessages[error] || "Authentication failed. Please try again.";
      setStatus({
        type: "error",
        message: message,
      });

      // Clean up URL
      setTimeout(() => {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }, 3000);
    }
  }, [navigate]);

  const extractErrorMessage = (
    error,
    fallback = "Unable to sign in. Please try again."
  ) => {
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
  };

  const fields = [
    {
      name: "phoneNumber",
      label: "Mobile number",
      type: "tel",
      placeholder: "Enter your mobile number",
      required: true,
      autoComplete: "tel",
      inputMode: "numeric",
      maxLength: 10,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      required: true,
      autoComplete: "current-password",
      helperText: "Use the password you created during registration.",
      inputClassName: "pr-24",
    },
  ];

  const handleGoogleLogin = () => {
    try {
      setStatus({
        type: "info",
        message: "Redirecting to Google for authentication...",
      });
      googleLogin();
    } catch (error) {
      setStatus({
        type: "error",
        message: "Failed to initialize Google login. Please try again.",
      });
    }
  };

  const socialProviders = [{ label: "Google", onClick: handleGoogleLogin }];

  const handleLogin = async (formValues, { reset }) => {
    const mobileNumber = (formValues.phoneNumber ?? "")
      .replace(/[^0-9]/g, "")
      .slice(0, 10);
    const password = formValues.password ?? "";

    if (!mobileNumber || !password) {
      setStatus({
        type: "error",
        message: "Please enter both mobile number and password.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await loginUser({ mobileNumber, password });

      if (!response?.success) {
        throw new Error(response?.message ?? "Login failed");
      }

      storeAuthSession({ token: response.token, user: response.user });

      const redirectPath =
        response?.user?.role === "admin" ? "/admin/dashboard" : "/";

      setStatus({
        type: "success",
        message:
          response.message ??
          `Login successful. Redirecting to${
            redirectPath === "/" ? " the store" : " the admin dashboard"
          }...`,
      });

      reset?.();

      setTimeout(() => navigate(redirectPath, { replace: true }), 400);
    } catch (error) {
      setStatus({
        type: "error",
        message: extractErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2ee]">
      <UserNavbar />
      <AuthForm
        title="Welcome back"
        subtitle="Sign in to continue your shopping journey."
        fields={fields}
        onSubmit={handleLogin}
        onFieldChange={() => {
          if (status?.type === "error") {
            setStatus(null);
          }
        }}
        socialProviders={socialProviders}
        buttonLabel={buttonLabel}
        footerText="Don't have an account?"
        footerLinkText="Sign up"
        footerLinkHref="/signup"
        status={status}
        isSubmitDisabled={isSubmitting}
        forgetPasswordText="Forget Password?"
      />
    </div>
  );
};

export default Login;
