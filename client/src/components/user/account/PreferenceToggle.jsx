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
    className={`flex items-center justify-between gap-4 rounded-2xl border border-[#DCECE9] bg-white p-4 transition ${
      disabled ? "opacity-60" : "hover:border-[#b8985b]/70"
    }`}
  >
    <div className="space-y-1">
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      {description ? (
        <p className="text-xs text-slate-500">{description}</p>
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
          checked ? "bg-[#b8985b]" : "bg-slate-200"
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

export default PreferenceToggle;
