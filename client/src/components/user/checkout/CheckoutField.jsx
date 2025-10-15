const baseFieldClasses =
  "w-full rounded-2xl border border-[#DCECE9] bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#b8985b] focus:outline-none focus:ring-2 focus:ring-[#b8985b]/25 transition";

const CheckoutField = ({
  label,
  optional = false,
  type = "text",
  placeholder,
  autoComplete,
  options,
  ...rest
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
      {label}
      {optional ? (
        <span className="ml-2 text-[0.7rem] font-medium lowercase text-slate-400">
          optional
        </span>
      ) : null}
    </span>

    {Array.isArray(options) && options.length ? (
      <select className={baseFieldClasses} {...rest}>
        {options.map((option) => (
          <option
            key={option.value ?? option}
            value={option.value ?? option}
            disabled={option.disabled ?? false}
            hidden={option.hidden ?? false}
            className="bg-white text-sm text-slate-700"
          >
            {option.label ?? option}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={baseFieldClasses}
        {...rest}
      />
    )}
  </label>
);

export default CheckoutField;
