const baseClasses =
  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#b8985b] bg-[#b8985b] text-white shadow-lg shadow-[#b8985b]/25 disabled:cursor-not-allowed";

const Button = ({
  children,
  className = "",
  type = "button",
  disabled = false,
  onClick,
  ...props
}) => {
  const interactiveClasses = disabled ? "opacity-60" : "hover:bg-[#a9894f]";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${interactiveClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
