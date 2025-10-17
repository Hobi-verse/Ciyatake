const sizeMap = {
  sm: {
    spinner: "h-4 w-4 border-2",
    gap: "gap-1",
  },
  md: {
    spinner: "h-8 w-8 border-[3px]",
    gap: "gap-3",
  },
  lg: {
    spinner: "h-12 w-12 border-4",
    gap: "gap-4",
  },
};

const Loader = ({
  label,
  size = "md",
  className = "",
  spinnerClassName = "",
  labelClassName = "",
}) => {
  const safeSize = sizeMap[size] ? size : "md";
  const spinnerSizing = sizeMap[safeSize].spinner;
  const spacing = sizeMap[safeSize].gap;
  const shouldRenderLabel = label !== null;
  const displayLabel = label === undefined ? "Loading…" : label;

  const spinner = (
    <span
      className={`inline-block animate-spin rounded-full border-[#dec9a4] border-solid border-t-transparent ${spinnerSizing} ${spinnerClassName}`.trim()}
    >
      <span className="sr-only">Loading</span>
    </span>
  );

  if (!shouldRenderLabel) {
    return (
      <span
        className={`inline-flex items-center ${className}`}
        role="status"
        aria-live="polite"
      >
        {spinner}
      </span>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center ${spacing} text-[#8f7843] ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      {spinner}
      <span className={`text-sm font-medium ${labelClassName}`.trim()}>
        {displayLabel}
      </span>
    </div>
  );
};

export default Loader;
