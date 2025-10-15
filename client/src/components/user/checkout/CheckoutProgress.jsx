const statusStyles = {
  complete:
    "border-[#b8985b] bg-[#b8985b] text-white shadow-[0_14px_28px_rgba(184,152,91,0.3)]",
  current:
    "border-[#b8985b] bg-white text-[#b8985b] shadow-[0_18px_36px_rgba(15,23,42,0.12)]",
  upcoming: "border-[#DCECE9] bg-[#F2EAE0] text-slate-500",
};

const CheckoutProgress = ({ steps }) => {
  return (
    <nav
      aria-label="Checkout progress"
      className="rounded-3xl border border-[#DCECE9] bg-white p-4 shadow-[0_28px_60px_rgba(15,23,42,0.1)]"
    >
      <ol className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => {
          const variant = statusStyles[step.status] ?? statusStyles.upcoming;
          const isComplete = step.status === "complete";
          const isCurrent = step.status === "current";

          const labelClass =
            isCurrent || isComplete ? "text-slate-900" : "text-slate-600";

          return (
            <li
              key={step.label}
              className={`flex items-center gap-4 rounded-2xl border px-4 py-3 transition ${variant}`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent bg-white/70 text-base font-semibold text-slate-700">
                {isComplete ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-500">
                  Step {index + 1}
                </p>
                <p className={`text-sm font-semibold ${labelClass}`}>
                  {step.label}
                </p>
                {isCurrent ? (
                  <p className="text-xs text-slate-500">Currently selected</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default CheckoutProgress;
