const Skeleton = ({ className = "", rounded = true }) => (
  <div
    className={`${
      rounded ? "rounded-md" : ""
    } shimmer bg-[#f2eae0] ${className}`.trim()}
    aria-hidden="true"
  />
);

export default Skeleton;
