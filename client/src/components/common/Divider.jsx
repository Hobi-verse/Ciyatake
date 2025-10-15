const Divider = ({ className = "" }) => (
  <hr
    className={`my-4 border-t border-[#DCECE9] ${className}`.trim()}
    aria-hidden="true"
  />
);

export default Divider;
