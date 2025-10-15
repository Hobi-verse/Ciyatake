import { formatDate } from "./accountUtils.js";

const AccountNavigation = ({
  sections,
  selectedSection,
  onSelect,
  support,
}) => (
  <aside className="space-y-6">
    <div className="rounded-3xl border border-[#DCECE9] bg-white p-6">
      <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b8985b]">
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
                  ? "border-[#b8985b] bg-[#b8985b]/15 text-[#b8985b]"
                  : "border-[#DCECE9] bg-white text-slate-600 hover:border-[#b8985b]/50 hover:bg-[#F2EAE0] hover:text-[#b8985b]"
              }`}
            >
              {section.label}
            </button>
          );
        })}
      </div>
    </div>

    {support ? (
      <div className="rounded-3xl border border-[#b8985b]/40 bg-[#F2EAE0] p-6 text-sm text-slate-700">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b8985b]">
          Need help?
        </p>
        <p className="mt-2 text-base font-semibold text-[#b8985b]">
          {support.concierge?.name}
        </p>
        <p className="text-xs text-slate-500">{support.concierge?.hours}</p>
        <div className="mt-4 space-y-2 text-sm">
          <p>Email: {support.concierge?.email}</p>
          <p>Phone: {support.concierge?.phone}</p>
        </div>
        {support.lastTicket ? (
          <div className="mt-4 rounded-2xl border border-[#DCECE9] bg-white p-3 text-xs text-slate-500">
            <p className="font-semibold text-[#b8985b]">
              Last ticket · {support.lastTicket.status}
            </p>
            <p>{support.lastTicket.subject}</p>
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-400">
              Updated {formatDate(support.lastTicket.updatedOn)}
            </p>
          </div>
        ) : null}
      </div>
    ) : null}
  </aside>
);

export default AccountNavigation;
