const baseClasses =
  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#b8985b] disabled:cursor-not-allowed";

const variantClasses = {
  primary: "bg-[#b8985b] text-white shadow-lg shadow-[#b8985b]/25",
  outline:
    "border border-[#b8985b] bg-white text-[#b8985b] hover:border-[#a9894f] hover:bg-[#F2EAE0]",
  ghost: "bg-transparent text-[#b8985b] hover:bg-[#F2EAE0]",
};

const hoverClasses = {
  primary: "hover:bg-[#a9894f]",
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
