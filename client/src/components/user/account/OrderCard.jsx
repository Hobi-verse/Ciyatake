import formatINR from "../../../utils/currency.js";
import { orderStatusStyles } from "./accountConstants.js";
import { formatDate } from "./accountUtils.js";

const OrderCard = ({ order }) => {
  if (!order) {
    return null;
  }

  const statusClass =
    orderStatusStyles[order.status] ?? orderStatusStyles.Default;

  return (
    <div className="rounded-2xl border border-[#DCECE9] bg-white p-4 shadow-[0_18px_36px_rgba(15,23,42,0.08)] transition hover:border-[#b8985b]/60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Order {order.id}
          </p>
          <p className="text-xs text-slate-500">
            Placed on {formatDate(order.placedOn)} · {order.items} items
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
        >
          {order.status}
        </span>
      </div>
      <div className="mt-4 grid gap-4 text-sm text-slate-600 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Total amount
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {formatINR(order.total)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Payment method
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {order.paymentMethod}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Delivery
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {order.status === "Delivered"
              ? `Delivered on ${formatDate(order.deliveredOn)}`
              : order.expectedDelivery
              ? `Arriving by ${formatDate(order.expectedDelivery)}`
              : "We'll update you soon"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
