import { formatINR } from "../../../utils/currency.js";
import arrowRightIcon from "../../../assets/icons/arrow-right.svg";
import EditableOrderItem from "./EditableOrderItem.jsx";
import OrderSummaryRow from "../../common/OrderSummaryRow.jsx";

const CheckoutOrderSummary = ({
  order,
  onPlaceOrder,
  onQuantityChange,
  isPlacingOrder = false,
}) => {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal; // Only product price, no shipping or tax

  return (
    <aside className="space-y-4 sm:space-y-6 rounded-2xl sm:rounded-3xl border border-[#DCECE9] bg-white p-4 sm:p-6 shadow-[0_28px_64px_rgba(15,23,42,0.12)]">
      <header className="space-y-1 sm:space-y-2">
        <p className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-500">
          Your order
        </p>
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">Order Summary</h2>
      </header>

      <div className="space-y-3 sm:space-y-4">
        {order.items.map((item) => (
          <EditableOrderItem 
            key={item.id} 
            item={item} 
            onQuantityChange={onQuantityChange}
          />
        ))}
      </div>

      <div className="space-y-2 sm:space-y-3 border-t border-[#DCECE9] pt-3 sm:pt-4 text-xs sm:text-sm text-slate-600">
        <OrderSummaryRow label="Subtotal" value={formatINR(subtotal)} />
      </div>

      <OrderSummaryRow label="Total" value={formatINR(total)} emphasis />

      <div className="space-y-2 sm:space-y-3">
        <button
          type="button"
          onClick={() => onPlaceOrder?.(order)}
          disabled={isPlacingOrder}
          className={`flex w-full items-center justify-center gap-2 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition ${
            isPlacingOrder
              ? "cursor-not-allowed border border-[#DCECE9] bg-[#F2EAE0] text-slate-500"
              : "border border-transparent bg-[#b8985b] text-white shadow-lg shadow-[#b8985b]/25 hover:bg-[#a9894f]"
          }`}
        >
          {isPlacingOrder ? "Processing order..." : "Place Order"}
          {isPlacingOrder ? null : (
            <img src={arrowRightIcon} alt="" aria-hidden className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
          )}
        </button>
        <p className="text-center text-[0.65rem] sm:text-xs text-slate-500">
          Your payment information is encrypted and secure.
        </p>
      </div>
    </aside>
  );
};

export default CheckoutOrderSummary;
