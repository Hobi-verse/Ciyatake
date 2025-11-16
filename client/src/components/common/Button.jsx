const baseClasses =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8985b] disabled:cursor-not-allowed active:scale-[0.98]";

const variantClasses = {
  primary: "bg-gradient-to-r from-[#b8985b] to-[#a9894f] text-white shadow-lg shadow-[#b8985b]/30",
  outline:
    "border-2 border-[#b8985b] bg-white text-[#b8985b] hover:border-[#a9894f] hover:bg-[#b8985b]/5",
  ghost: "bg-transparent text-[#b8985b] hover:bg-[#b8985b]/10",
};

const hoverClasses = {
  primary: "hover:from-[#a9894f] hover:to-[#98793f] hover:shadow-xl hover:shadow-[#b8985b]/40",
  outline: "hover:text-[#a9894f]",
  ghost: "hover:text-[#a9894f]",
};

const Button = ({
  children,
  className = "",
  type = "button",
  disabled = false,
  onClick,
  variant = "primary",
  ...props
}) => {
  const resolvedVariant = variantClasses[variant] ? variant : "primary";

  const interactive = disabled
    ? "opacity-60"
    : hoverClasses[resolvedVariant] ?? "";

  const classes = [
    baseClasses,
    variantClasses[resolvedVariant],
    interactive,
    className,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
