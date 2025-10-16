import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../api/auth.js";
import {
  AUTH_SESSION_EVENT,
  clearAuthSession,
  getStoredAuthSession,
} from "../../../utils/authStorage.js";

const normalizeUserDetails = (user) => {
  if (!user) {
    return null;
  }

  const nameCandidates = [
    typeof user.name === "string" ? user.name.trim() : "",
    typeof user.fullName === "string" ? user.fullName.trim() : "",
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim(),
  ];

  const nonEmptyName = nameCandidates.find((value) => value && value.length);
  const displayName =
    nonEmptyName || user.email || user.mobileNumber || "Admin";

  const initials = displayName.trim().charAt(0).toUpperCase() || "A";
  const roleLabel = user.role || user.position || "Admin";

  return {
    ...user,
    displayName,
    roleLabel,
    initials,
  };
};

const AdminHeader = () => {
  const navigate = useNavigate();
  const [sessionVersion, setSessionVersion] = useState(0);
  const [state, setState] = useState(() => {
    const { user } = getStoredAuthSession();
    return {
      user: user ?? null,
      loading: false,
      error: null,
    };
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const session = getStoredAuthSession();
    setState({
      user: session?.user ?? null,
      loading: false,
      error: null,
    });
  }, [sessionVersion]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleSessionChange = () => {
      const session = getStoredAuthSession();
      setState((previous) => ({
        ...previous,
        user: session.user ?? null,
      }));
      setSessionVersion((value) => value + 1);
    };

    window.addEventListener(AUTH_SESSION_EVENT, handleSessionChange);
    window.addEventListener("storage", handleSessionChange);

    return () => {
      window.removeEventListener(AUTH_SESSION_EVENT, handleSessionChange);
      window.removeEventListener("storage", handleSessionChange);
    };
  }, []);

  const resolvedUser = useMemo(
    () => normalizeUserDetails(state.user),
    [state.user]
  );

  const subtitle = state.loading
    ? "Syncing your admin workspace..."
    : "Manage your commerce operations with real-time insights.";

  const signInMessage = state.loading
    ? "Syncing session..."
    : resolvedUser
    ? `Signed in as ${resolvedUser.displayName}`
    : "You are not signed in";

  const avatarLabel = state.loading ? "..." : resolvedUser?.initials ?? "?";

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logoutUser();
    } catch (error) {
      console.warn("Logout request failed", error);
    } finally {
      clearAuthSession();
      setState({ user: null, loading: false, error: null });
      setIsLoggingOut(false);
      navigate("/login", { replace: true });
    }
  }, [isLoggingOut, navigate]);

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center gap-4 border-b border-emerald-100/70 bg-white/95 px-8 text-emerald-900 shadow-lg backdrop-blur">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
        <p className="hidden text-sm text-emerald-700/80 md:block">
          {subtitle}
        </p>
        {state.error ? (
          <p className="hidden text-xs text-rose-600 md:block">
            Unable to sync admin details right now.
          </p>
        ) : null}
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div
          className="hidden rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 md:block"
          aria-live="polite"
        >
          {signInMessage}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="hidden items-center rounded-full border border-emerald-500/40 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-70 md:inline-flex"
        >
          {isLoggingOut ? "Signing out..." : "Logout"}
        </button>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600/90 text-lg font-semibold text-white shadow-inner">
          {avatarLabel}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
