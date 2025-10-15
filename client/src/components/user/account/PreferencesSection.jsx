import SectionCard from "./SectionCard.jsx";
import PreferenceToggle from "./PreferenceToggle.jsx";
import { preferenceLabels } from "./accountConstants.js";
import { formatDate } from "./accountUtils.js";

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
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
        {preferenceError}
      </div>
    ) : null}
    {preferenceMessage ? (
      <div className="rounded-2xl border border-[#c3dedd] bg-[#c3dedd]/25 p-4 text-sm text-[#2f4a55]">
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

    <div className="mt-6 rounded-2xl border border-[#DCECE9] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
      <h3 className="text-sm font-semibold text-slate-900">Security check</h3>
      <dl className="mt-3 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Last password update
          </dt>
          <dd className="mt-1 text-sm text-slate-800">
            {formatDate(security?.lastPasswordChange)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">
            2-step verification
          </dt>
          <dd className="mt-1 text-sm text-slate-800">
            {security?.twoFactorEnabled ? "Enabled" : "Not enabled"}
          </dd>
        </div>
      </dl>

      {Array.isArray(security?.trustedDevices) &&
      security.trustedDevices.length ? (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Trusted devices
          </p>
          {security.trustedDevices.map((device) => (
            <div
              key={device.id}
              className="rounded-2xl border border-[#DCECE9] bg-[#F2EAE0] p-3 text-sm text-slate-600"
            >
              <p className="font-medium text-slate-800">
                {device.device || "Trusted device"}
              </p>
              <p className="text-xs text-slate-500">
                {device.location || "Location unknown"}
              </p>
              <p className="text-xs text-slate-500">
                Last active: {formatDate(device.lastActive)}
              </p>
              {device.trusted ? (
                <span className="mt-2 inline-flex rounded-full border border-[#b8985b]/60 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#b8985b]">
                  Trusted
                </span>
              ) : (
                <button
                  type="button"
                  className="mt-2 inline-flex rounded-full border border-slate-300 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500 transition hover:border-[#b8985b] hover:text-[#b8985b]"
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
        className="mt-4 inline-flex items-center justify-center rounded-full border border-[#b8985b] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#b8985b] transition hover:bg-[#b8985b] hover:text-white"
      >
        Review security settings
      </button>
    </div>
  </SectionCard>
);

export default PreferencesSection;
