import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/common/AuthForm";
import UserNavbar from "../../components/user/common/UserNavbar";
import Loader from "../../components/common/Loader.jsx";
import { loginUser, googleLogin } from "../../api/auth";
import { storeAuthSession } from "../../utils/authStorage";

const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

  const buttonLabel = useMemo(
    () => (isSubmitting ? "Signing in..." : "Sign In"),
    [isSubmitting]
  );

  // Handle Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    let cleanupTimeout;

    if (token) {
      setIsProcessingOAuth(true);
      // Handle successful Google login
      setStatus({
        type: "success",
        message: "Google login successful! Redirecting...",
      });

      // Store the token
      localStorage.setItem("authToken", token);

      // You may want to get user info here
      // For now, redirect to home page
      cleanupTimeout = window.setTimeout(() => {
        setIsProcessingOAuth(false);
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
      setIsProcessingOAuth(true);
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
      cleanupTimeout = window.setTimeout(() => {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        setIsProcessingOAuth(false);
      }, 3000);
    }
    return () => {
      if (cleanupTimeout) {
        window.clearTimeout(cleanupTimeout);
      }
    };
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
      name: "email",
      label: "Email address",
      type: "email",
      placeholder: "Enter your email address",
      required: true,
      autoComplete: "email",
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
    const email = formValues.email?.trim() ?? "";
    const password = formValues.password ?? "";

    if (!email || !password) {
      setStatus({
        type: "error",
        message: "Please enter both email address and password.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await loginUser({ email, password });

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

  const showRefreshLoader = !isProcessingOAuth && isSubmitting;
  const loaderLabel = "Signing you in";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f2ee] via-[#faf8f5] to-[#f0ede8]">
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
        isSubmitDisabled={isSubmitting || isProcessingOAuth}
        loading={isProcessingOAuth}
        forgetPasswordText="Forget Password?"
      />
      {showRefreshLoader ? (
        <div className="flex justify-center pt-6 pb-8">
          <Loader label={loaderLabel} />
        </div>
      ) : null}
    </div>
  );
};

export default Login;
