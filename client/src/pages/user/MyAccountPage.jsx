import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import UserNavbar from "../../components/user/common/UserNavbar.jsx";
import Breadcrumbs from "../../components/common/Breadcrumbs.jsx";
import {
  fetchAccountSummary,
  updateAccountPreferences,
} from "../../api/user.js";
import formatINR from "../../utils/currency.js";

const accountSections = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders & returns" },
  { id: "addresses", label: "Addresses" },
  { id: "payments", label: "Payments & wallet" },
  { id: "preferences", label: "Security & preferences" },
];

const orderStatusStyles = {
  "Out for delivery": "bg-emerald-400/15 text-emerald-100",
  Delivered: "bg-emerald-500/15 text-emerald-100",
  Processing: "bg-amber-400/15 text-amber-100",
  Cancelled: "bg-rose-500/20 text-rose-100",
  Default: "bg-white/10 text-emerald-100",
};

const preferenceLabels = {
  marketingEmails: "Product updates & offers",
  smsUpdates: "Shipping & delivery SMS",
  whatsappUpdates: "WhatsApp alerts",
  orderReminders: "Cart reminders",
  securityAlerts: "Security alerts",
};

const toDate = (value) => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (value) => {
  const parsed = toDate(value);
  if (!parsed) {
    return value ?? "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const SectionCard = ({
  title,
  description,
  action,
  children,
  className = "",
}) => (
  <section
    className={`rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-900/10 backdrop-blur ${className}`.trim()}
  >
    {(title || description || action) && (
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          {title ? (
            <h2 className="text-lg font-semibold text-white md:text-xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="text-sm text-emerald-200/75">{description}</p>
          ) : null}
        </div>
        {action ? (
          <div className="text-sm text-emerald-200/80">{action}</div>
        ) : null}
      </header>
    )}

    {children ? <div className="mt-4 space-y-4">{children}</div> : null}
  </section>
);

const StatCard = ({ label, value, trend }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/60">
      {label}
    </p>
    <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    {trend ? <p className="mt-1 text-xs text-emerald-200/70">{trend}</p> : null}
  </div>
);

const OrderCard = ({ order }) => {
  if (!order) {
    return null;
  }

  const statusClass =
    orderStatusStyles[order.status] ?? orderStatusStyles.Default;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-emerald-200/40">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Order {order.id}</p>
          <p className="text-xs text-emerald-200/70">
            Placed on {formatDate(order.placedOn)} · {order.items} items
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
        >
          {order.status}
        </span>
      </div>
      <div className="mt-4 grid gap-4 text-sm text-emerald-200/80 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/60">
            Total amount
          </p>
          <p className="mt-1 text-sm font-medium text-emerald-100">
            {formatINR(order.total)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/60">
            Payment method
          </p>
          <p className="mt-1 text-sm font-medium text-emerald-100">
            {order.paymentMethod}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/60">
            Delivery
          </p>
          <p className="mt-1 text-sm font-medium text-emerald-100">
            {order.status === "Delivered"
              ? `Delivered on ${formatDate(order.deliveredOn)}`
              : order.expectedDelivery
              ? `Arriving by ${formatDate(order.expectedDelivery)}`
              : "We'll update you soon"}
          </p>
        </div>
      </div>
    </div>
  );
};

const AddressCard = ({ address }) => {
  if (!address) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{address.label}</p>
          <p className="text-xs text-emerald-200/70">{address.recipient}</p>
        </div>
        {address.isDefault ? (
          <span className="rounded-full border border-emerald-300/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
            Default
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm text-emerald-100">
        {address.addressLine1}
        {address.addressLine2 ? `, ${address.addressLine2}` : ""}
      </p>
      <p className="text-sm text-emerald-100">
        {address.city}, {address.state} {address.postalCode}
      </p>
      <p className="text-xs text-emerald-200/70">{address.country}</p>
      <p className="mt-2 text-xs text-emerald-200/70">Phone: {address.phone}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/80">
        <button
          type="button"
          className="rounded-full border border-white/10 px-3 py-1 transition hover:border-emerald-200/70 hover:text-emerald-100"
        >
          Edit
        </button>
        <button
          type="button"
          className="rounded-full border border-white/10 px-3 py-1 transition hover:border-emerald-200/70 hover:text-emerald-100"
        >
          Set default
        </button>
      </div>
    </div>
  );
};

const PaymentCard = ({ payment }) => {
  if (!payment) {
    return null;
  }

  const details = [
    payment.type === "Credit Card" && payment.last4
      ? `${payment.brand} ending •••• ${payment.last4}`
      : null,
    payment.handle,
    payment.holderName,
    payment.expiry ? `Expires ${payment.expiry}` : null,
  ].filter(Boolean);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{payment.brand}</p>
          <p className="text-xs text-emerald-200/70">{payment.type}</p>
        </div>
        {payment.isDefault ? (
          <span className="rounded-full border border-emerald-300/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
            Primary
          </span>
        ) : null}
      </div>

      {payment.type === "Wallet" ? (
        <p className="mt-3 text-lg font-semibold text-emerald-100">
          Balance: {formatINR(payment.balance)}
        </p>
      ) : null}

      {details.length ? (
        <ul className="mt-3 space-y-1 text-sm text-emerald-200/80">
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/80">
        <button
          type="button"
          className="rounded-full border border-white/10 px-3 py-1 transition hover:border-emerald-200/70 hover:text-emerald-100"
        >
          Manage
        </button>
        <button
          type="button"
          className="rounded-full border border-white/10 px-3 py-1 transition hover:border-emerald-200/70 hover:text-emerald-100"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

const PreferenceToggle = ({
  id,
  label,
  description,
  checked,
  disabled = false,
  busy = false,
  onChange,
}) => (
  <label
    htmlFor={id}
    className={`flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition ${
      disabled ? "opacity-60" : "hover:border-emerald-200/60"
    }`}
  >
    <div className="space-y-1">
      <p className="text-sm font-semibold text-white">{label}</p>
      {description ? (
        <p className="text-xs text-emerald-200/70">{description}</p>
      ) : null}
    </div>
    <div className="relative">
      <input
        id={id}
        type="checkbox"
        className="peer sr-only"
        checked={!!checked}
        onChange={onChange}
        disabled={disabled || busy}
      />
      <div
        className={`h-6 w-12 rounded-full transition ${
          checked ? "bg-emerald-400/80" : "bg-white/15"
        } ${busy ? "animate-pulse" : ""}`}
      />
      <div
        className={`pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </div>
  </label>
);

const AccountNavigation = ({
  sections,
  selectedSection,
  onSelect,
  support,
}) => (
  <aside className="space-y-6">
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200/70">
        Account menu
      </h2>
      <div className="mt-4 flex flex-wrap gap-2 lg:flex-col">
        {sections.map((section) => {
          const isActive = section.id === selectedSection;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                isActive
                  ? "border-emerald-300/70 bg-emerald-400/10 text-emerald-100"
                  : "border-white/10 bg-white/5 text-emerald-200/80 hover:border-emerald-200/50 hover:bg-emerald-400/10 hover:text-emerald-100"
              }`}
            >
              {section.label}
            </button>
          );
        })}
      </div>
    </div>

    {support ? (
      <div className="rounded-3xl border border-emerald-300/30 bg-emerald-500/10 p-6 text-sm text-emerald-100">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200/70">
          Need help?
        </p>
        <p className="mt-2 text-base font-semibold">
          {support.concierge?.name}
        </p>
        <p className="text-xs text-emerald-200/80">
          {support.concierge?.hours}
        </p>
        <div className="mt-4 space-y-2 text-sm">
          <p>Email: {support.concierge?.email}</p>
          <p>Phone: {support.concierge?.phone}</p>
        </div>
        {support.lastTicket ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-emerald-200/80">
            <p className="font-semibold text-emerald-100">
              Last ticket · {support.lastTicket.status}
            </p>
            <p>{support.lastTicket.subject}</p>
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-emerald-200/60">
              Updated {formatDate(support.lastTicket.updatedOn)}
            </p>
          </div>
        ) : null}
      </div>
    ) : null}
  </aside>
);

const OverviewSection = ({
  profile,
  stats,
  recentOrders,
  paymentMethods,
  onShowOrders,
}) => {
  const nextTier = profile?.nextTier ?? {};
  const latestOrder = recentOrders?.[0];
  const defaultPayment = paymentMethods?.find((method) => method.isDefault);

  const statCards = Array.isArray(stats)
    ? stats.map((stat) => {
        if (stat.id === "credits") {
          return {
            ...stat,
            valueLabel: formatINR(stat.value),
          };
        }

        return {
          ...stat,
          valueLabel: stat.value,
        };
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="rounded-3xl border border-emerald-300/40 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent p-6 text-emerald-50">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100/70">
            Profile overview
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {profile?.name ?? "Guest"}
          </h2>
          <p className="mt-1 text-sm text-emerald-100/80">{profile?.email}</p>
          <p className="text-sm text-emerald-100/70">{profile?.phone}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100/80">
            <span className="rounded-full border border-emerald-200/60 px-3 py-1">
              {profile?.membershipTier ?? "Member"} tier
            </span>
            <span className="rounded-full border border-emerald-200/60 px-3 py-1">
              Since {formatDate(profile?.memberSince)}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <p className="text-emerald-100/80">Reward points</p>
              <p className="text-lg font-semibold text-white">
                {profile?.rewardPoints ?? 0}
              </p>
            </div>
            <div className="h-2 w-full rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, nextTier.progressPercent ?? 0)
                  )}%`,
                }}
              />
            </div>
            <p className="text-xs text-emerald-100/70">
              {nextTier.pointsNeeded
                ? `${nextTier.pointsNeeded} points to reach ${nextTier.name}`
                : "Keep shopping to unlock the next tier"}
            </p>
          </div>
        </div>

        <SectionCard
          title="Quick stats"
          description="A snapshot of your activity on Ciyatake."
          className="h-full"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {statCards.length ? (
              statCards.map((stat) => (
                <StatCard
                  key={stat.id}
                  label={stat.label}
                  value={stat.valueLabel}
                  trend={stat.trend}
                />
              ))
            ) : (
              <p className="text-sm text-emerald-200/70">
                We&apos;ll show your stats once you have some activity.
              </p>
            )}
          </div>
        </SectionCard>
      </div>

      {latestOrder ? (
        <SectionCard
          title="Track your latest order"
          description="We keep this section updated so you always know what's next."
          action={
            <button
              type="button"
              onClick={onShowOrders}
              className="inline-flex items-center justify-center rounded-full border border-emerald-300/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100 transition hover:border-emerald-200"
            >
              View all orders
            </button>
          }
        >
          <OrderCard order={latestOrder} />
        </SectionCard>
      ) : null}

      {defaultPayment ? (
        <SectionCard
          title="Preferred payment"
          description="This method will be used for faster checkout."
        >
          <PaymentCard payment={defaultPayment} />
        </SectionCard>
      ) : null}
    </div>
  );
};

const OrdersSection = ({ orders }) => (
  <SectionCard
    title="Orders & returns"
    description="Track deliveries, download invoices, and start a return if needed."
  >
    {Array.isArray(orders) && orders.length ? (
      orders.map((order) => <OrderCard key={order.id} order={order} />)
    ) : (
      <div className="rounded-2xl border border-dashed border-emerald-200/40 bg-white/5 p-6 text-sm text-emerald-200/70">
        You haven&apos;t placed any orders yet. Once you do, they&apos;ll show
        up here for quick access.
      </div>
    )}
  </SectionCard>
);

const AddressesSection = ({ addresses }) => (
  <SectionCard
    title="Saved addresses"
    description="Manage where you want your orders to arrive."
  >
    {Array.isArray(addresses) && addresses.length ? (
      <div className="grid gap-4 lg:grid-cols-2">
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </div>
    ) : (
      <div className="rounded-2xl border border-dashed border-emerald-200/40 bg-white/5 p-6 text-sm text-emerald-200/70">
        Add a shipping address to speed up checkout.
      </div>
    )}
    <button
      type="button"
      className="mt-4 inline-flex items-center justify-center rounded-full border border-emerald-300/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100 transition hover:border-emerald-200"
    >
      Add new address
    </button>
  </SectionCard>
);

const PaymentsSection = ({ paymentMethods, walletBalance }) => (
  <SectionCard
    title="Payments & wallet"
    description="Keep your payments up to date for one-tap checkout."
  >
    {Array.isArray(paymentMethods) && paymentMethods.length ? (
      <div className="grid gap-4 lg:grid-cols-2">
        {paymentMethods.map((payment) => (
          <PaymentCard key={payment.id} payment={payment} />
        ))}
      </div>
    ) : (
      <div className="rounded-2xl border border-dashed border-emerald-200/40 bg-white/5 p-6 text-sm text-emerald-200/70">
        Save a payment method to check out faster and earn rewards.
      </div>
    )}
    <div className="mt-4 rounded-2xl border border-emerald-300/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200/70">
        Wallet balance
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">
        {formatINR(walletBalance)}
      </p>
      <p className="text-xs text-emerald-200/80">
        Earn more credits when you pay online.
      </p>
    </div>
    <button
      type="button"
      className="mt-4 inline-flex items-center justify-center rounded-full border border-emerald-300/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100 transition hover:border-emerald-200"
    >
      Add payment method
    </button>
  </SectionCard>
);

const PreferencesSection = ({
  preferences,
  togglePreference,
  pendingPreference,
  preferenceError,
  preferenceMessage,
  security,
}) => (
  <SectionCard
    title="Security & preferences"
    description="Control how we reach you and keep your account safe."
  >
    {preferenceError ? (
      <div className="rounded-2xl border border-rose-300/40 bg-rose-500/10 p-4 text-sm text-rose-100">
        {preferenceError}
      </div>
    ) : null}
    {preferenceMessage ? (
      <div className="rounded-2xl border border-emerald-300/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">
        {preferenceMessage}
      </div>
    ) : null}

    <div className="space-y-3">
      {Object.entries(preferenceLabels).map(([key, label]) => (
        <PreferenceToggle
          key={key}
          id={`pref-${key}`}
          label={label}
          description={
            key === "securityAlerts"
              ? "Important alerts about sign-ins and account settings."
              : undefined
          }
          checked={!!preferences?.[key]}
          busy={pendingPreference === key}
          onChange={() => togglePreference(key)}
        />
      ))}
    </div>

    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
      <h3 className="text-sm font-semibold text-white">Security check</h3>
      <dl className="mt-3 grid gap-3 text-sm text-emerald-200/80 md:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-emerald-200/60">
            Last password update
          </dt>
          <dd className="mt-1 text-sm text-emerald-100">
            {formatDate(security?.lastPasswordChange)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-emerald-200/60">
            2-step verification
          </dt>
          <dd className="mt-1 text-sm text-emerald-100">
            {security?.twoFactorEnabled ? "Enabled" : "Not enabled"}
          </dd>
        </div>
      </dl>

      {Array.isArray(security?.trustedDevices) &&
      security.trustedDevices.length ? (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200/60">
            Trusted devices
          </p>
          {security.trustedDevices.map((device) => (
            <div
              key={device.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-emerald-200/80"
            >
              <p className="font-medium text-emerald-100">{device.device}</p>
              <p className="text-xs text-emerald-200/70">{device.location}</p>
              <p className="text-xs text-emerald-200/70">
                Last active: {device.lastActive}
              </p>
              {device.trusted ? (
                <span className="mt-2 inline-flex rounded-full border border-emerald-300/60 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-emerald-100">
                  Trusted
                </span>
              ) : (
                <button
                  type="button"
                  className="mt-2 inline-flex rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-emerald-200/80 transition hover:border-emerald-200/60 hover:text-emerald-100"
                >
                  Remove access
                </button>
              )}
            </div>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        className="mt-4 inline-flex items-center justify-center rounded-full border border-emerald-300/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100 transition hover:border-emerald-200"
      >
        Review security settings
      </button>
    </div>
  </SectionCard>
);

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
      await updateAccountPreferences({ [key]: nextValue });
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
