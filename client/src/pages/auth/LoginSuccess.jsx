import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storeAuthSession, clearAuthSession } from "../../utils/authStorage";
import { getUserProfile } from "../../api/auth";

const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (!token) {
          throw new Error("No token received");
        }

        // Persist the token so authenticated requests include it
        storeAuthSession({ token });

        // Get user profile with the token
        try {
          const profileResponse = await getUserProfile();

          if (profileResponse?.success && profileResponse?.user) {
            // Store complete auth session
            storeAuthSession({
              token: token,
              user: profileResponse.user,
            });

            // Determine redirect path based on user role
            const redirectPath =
              profileResponse.user.role === "admin" ? "/admin/dashboard" : "/";

            // Redirect to appropriate page
            navigate(redirectPath, { replace: true });
          } else {
            throw new Error("Failed to get user profile");
          }
        } catch (profileError) {
          // If profile fetch fails, still store token and redirect
          console.warn("Profile fetch failed:", profileError);

          // Store basic auth session
          storeAuthSession({
            token: token,
            user: { id: "google-user" },
          });

          // Redirect to home page
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Google login callback error:", error);

        // Clear any stored auth session to avoid stale state
        clearAuthSession();

        // Redirect to login with error
        navigate("/login?error=google_callback_failed", { replace: true });
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f2ee]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#b8985b]"></div>
        <h2 className="mb-2 text-xl font-semibold text-slate-900">
          Completing Google Sign-In
        </h2>
        <p className="text-slate-600">
          Please wait while we set up your account...
        </p>
      </div>
    </div>
  );
};

export default LoginSuccess;
