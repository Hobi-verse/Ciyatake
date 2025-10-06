import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import UserNavbar from "../../components/user/common/UserNavbar.jsx";
import Breadcrumbs from "../../components/common/Breadcrumbs.jsx";
import {
  fetchAccountSummary,
  updateAccountPreferences,
} from "../../api/user.js";
import AccountNavigation from "../../components/user/account/AccountNavigation.jsx";
import OverviewSection from "../../components/user/account/OverviewSection.jsx";
import OrdersSection from "../../components/user/account/OrdersSection.jsx";
import AddressesSection from "../../components/user/account/AddressesSection.jsx";
import PaymentsSection from "../../components/user/account/PaymentsSection.jsx";
import PreferencesSection from "../../components/user/account/PreferencesSection.jsx";
import {
  accountSections,
  preferenceLabels,
} from "../../components/user/account/accountConstants.js";

const MyAccountPage = ({ isLoggedIn }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState("overview");
  const [preferences, setPreferences] = useState({});
  const [pendingPreference, setPendingPreference] = useState("");
  const [preferenceError, setPreferenceError] = useState("");
  const [preferenceMessage, setPreferenceMessage] = useState("");
  const successTimeoutRef = useRef();

  const loadSummary = useCallback(async ({ signal } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAccountSummary({ signal });
      if (signal?.aborted) {
        return;
      }

      setSummary(response ?? {});
      setPreferences(response?.preferences ?? {});
    } catch (apiError) {
      if (!signal?.aborted) {
        setError(apiError);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadSummary({ signal: controller.signal });

    return () => {
      controller.abort();
      if (successTimeoutRef.current && typeof window !== "undefined") {
        window.clearTimeout(successTimeoutRef.current);
      }
    };
  }, [loadSummary]);

  const handlePreferenceToggle = async (key) => {
    if (!key) {
      return;
    }

    const nextValue = !preferences?.[key];
    setPreferences((current) => ({
      ...current,
      [key]: nextValue,
    }));
    setPendingPreference(key);
    setPreferenceError("");
    setPreferenceMessage("");

    try {
      const updatedPreferences = await updateAccountPreferences({
        [key]: nextValue,
      });
      if (updatedPreferences && typeof updatedPreferences === "object") {
        setPreferences((current) => ({
          ...current,
          ...updatedPreferences,
        }));
      }
      if (successTimeoutRef.current && typeof window !== "undefined") {
        window.clearTimeout(successTimeoutRef.current);
      }
      const label = preferenceLabels[key] ?? key;
      setPreferenceMessage(`${label} updated.`);
      if (typeof window !== "undefined") {
        successTimeoutRef.current = window.setTimeout(() => {
          setPreferenceMessage("");
        }, 2800);
      }
    } catch (apiError) {
      setPreferences((current) => ({
        ...current,
        [key]: !nextValue,
      }));
      setPreferenceError(
        apiError?.message || "We couldn't update your preferences just yet."
      );
    } finally {
      setPendingPreference("");
    }
  };

  const orders = useMemo(
    () => (Array.isArray(summary?.recentOrders) ? summary.recentOrders : []),
    [summary]
  );
  const addresses = useMemo(
    () => (Array.isArray(summary?.addresses) ? summary.addresses : []),
    [summary]
  );
  const payments = useMemo(
    () =>
      Array.isArray(summary?.paymentMethods) ? summary.paymentMethods : [],
    [summary]
  );

  return (
    <div className="min-h-screen bg-[#07150f] text-emerald-50">
      <UserNavbar isLoggedIn={isLoggedIn} />
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-12">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "My account" }]}
        />

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            My account
          </h1>
          <p className="text-sm text-emerald-200/80">
            Manage your personal details, orders, and how you hear from us.
          </p>
        </header>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-emerald-200/70">
            Loading your account...
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="rounded-3xl border border-rose-300/40 bg-rose-500/10 p-8 text-sm text-rose-100">
              We couldn&apos;t load your account details right now.
            </div>
            <button
              type="button"
              onClick={() => loadSummary()}
              className="inline-flex items-center justify-center rounded-full border border-emerald-300/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100 transition hover:border-emerald-200"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)]">
            <AccountNavigation
              sections={accountSections}
              selectedSection={selectedSection}
              onSelect={setSelectedSection}
              support={summary?.support}
            />

            <div className="space-y-6">
              {selectedSection === "overview" ? (
                <OverviewSection
                  profile={summary?.profile}
                  stats={summary?.stats}
                  recentOrders={orders}
                  paymentMethods={payments}
                  onShowOrders={() => setSelectedSection("orders")}
                />
              ) : null}

              {selectedSection === "orders" ? (
                <OrdersSection orders={orders} />
              ) : null}

              {selectedSection === "addresses" ? (
                <AddressesSection addresses={addresses} />
              ) : null}

              {selectedSection === "payments" ? (
                <PaymentsSection
                  paymentMethods={payments}
                  walletBalance={summary?.profile?.walletBalance ?? 0}
                />
              ) : null}

              {selectedSection === "preferences" ? (
                <PreferencesSection
                  preferences={preferences}
                  togglePreference={handlePreferenceToggle}
                  pendingPreference={pendingPreference}
                  preferenceError={preferenceError}
                  preferenceMessage={preferenceMessage}
                  security={summary?.security}
                />
              ) : null}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyAccountPage;
