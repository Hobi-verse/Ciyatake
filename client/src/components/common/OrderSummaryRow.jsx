const OrderSummaryRow = ({ label, value, emphasis = false }) => {
  if (label == null && value == null) {
    return null;
  }

  const valueClasses = emphasis
    ? "text-lg font-semibold text-[#b8985b]"
    : "text-slate-700";

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={valueClasses}>{value}</span>
    </div>
  );
};

export default OrderSummaryRow;
