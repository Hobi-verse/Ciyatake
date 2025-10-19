import formatINR from "../../../utils/currency.js";
import { orderStatusStyles } from "./accountConstants.js";
import { formatDate, formatDateTime } from "./accountUtils.js";

const getTimelineIndicatorClasses = (status) => {
  switch (status) {
    case "complete":
      return "bg-[#8f7843] border-[#8f7843]";
    case "current":
      return "bg-[#b8985b] border-[#b8985b]";
    default:
      return "bg-white border-[#DCECE9]";
  }
};

const OrderTimeline = ({ timeline }) => {
  if (!Array.isArray(timeline) || !timeline.length) {
    return (
      <p className="rounded-lg border border-dashed border-[#DCECE9] bg-[#F2EAE0] px-3 py-2 text-xs text-slate-600">
        Tracking updates will appear here once your order moves to the next
        step.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {timeline.map((entry, index) => {
        const tone =
          entry.status ??
          (index === timeline.length - 1 ? "current" : "complete");

        return (
          <li
            key={entry.id ?? `${entry.title}-${index}`}
            className="relative pl-6"
          >
            {index !== timeline.length - 1 ? (
              <span className="absolute left-[6px] top-3 h-full w-px bg-[#E6DCCB]" />
            ) : null}
            <span
              className={`absolute left-0 top-[6px] h-3 w-3 rounded-full border ${getTimelineIndicatorClasses(
                tone
              )}`}
            />
            <div className="space-y-1 rounded-lg border border-[#F2EAE0] bg-white px-3 py-2 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  {entry.title || "Update"}
                </span>
                {entry.timestamp ? (
                  <span className="text-xs text-slate-400">
                    {formatDateTime(entry.timestamp)}
                  </span>
                ) : null}
              </div>
              {entry.description ? (
                <p className="text-xs text-slate-600">{entry.description}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

const OrderCard = ({ order }) => {
  if (!order) {
    return null;
  }

  const itemsCount = order.itemsCount ?? order.items ?? 0;
  const deliveredStatus =
    (order.statusRaw ?? "").toString().toLowerCase() === "delivered" ||
    order.statusLabel === "Delivered";
  const deliveryLabel = (() => {
    if (deliveredStatus) {
      return order.deliveredOn
        ? `Delivered on ${formatDate(order.deliveredOn)}`
        : "Delivered";
    }
    if (order.delivery?.deliveryWindow) {
      return order.delivery.deliveryWindow;
    }
    if (order.expectedDelivery) {
      return `Arriving by ${formatDate(order.expectedDelivery)}`;
    }
    return "We'll update you soon";
  })();

  const statusClass =
    orderStatusStyles[order.statusLabel ?? order.status] ??
    orderStatusStyles.Default;

  const returnMessage = (() => {
    if (order.returnEligible && order.returnEligibleUntil) {
      return `Return window open until ${formatDate(
        order.returnEligibleUntil
      )}`;
    }
    if (!order.returnEligible && order.returnEligibleUntil) {
      return `Return window closed on ${formatDate(order.returnEligibleUntil)}`;
    }
    if (deliveredStatus) {
      return "Return window has ended.";
    }
    return "Returns open once your order is delivered.";
  })();

  const returnSubject = encodeURIComponent(
    `Return request for order ${order.orderNumber ?? order.id}`
  );
  const returnMailto = `mailto:support@ciyatake.com?subject=${returnSubject}`;
  const returnButtonClasses = order.returnEligible
    ? "border-[#b8985b] text-[#b8985b] hover:bg-[#b8985b] hover:text-white"
    : "border-[#DCECE9] text-slate-400 pointer-events-none";

  return (
    <div className="rounded-2xl border border-[#DCECE9] bg-white p-5 shadow-[0_18px_36px_rgba(15,23,42,0.08)] transition hover:border-[#b8985b]/60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Order {order.orderNumber ?? order.id}
          </p>
          <p className="text-xs text-slate-500">
            Placed on {formatDate(order.placedOn)} · {itemsCount} item
            {itemsCount === 1 ? "" : "s"}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
        >
          {order.statusLabel ?? order.status}
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
            {deliveryLabel}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Delivery timeline
          </p>
          <div className="mt-3 space-y-3">
            <OrderTimeline timeline={order.timeline} />
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-[#F2EAE0] bg-[#Fefbf6] px-4 py-3 text-sm text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Tracking details
            </p>
            <div className="mt-2 space-y-1">
              <p>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Tracking no.
                </span>
                <br />
                {order.trackingNumber || "Not assigned yet"}
              </p>
              <p>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Courier
                </span>
                <br />
                {order.courierService || "We'll share this soon"}
              </p>
            </div>
          </div>

          {order.shipping ? (
            <div className="rounded-xl border border-[#F2EAE0] bg-[#Fefbf6] px-4 py-3 text-sm text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Ship to
              </p>
              <div className="mt-2 space-y-1 text-sm text-slate-700">
                <p className="font-medium text-slate-800">
                  {order.shipping.recipient ?? "—"}
                </p>
                <p className="text-xs text-slate-500">
                  {[order.shipping.city, order.shipping.state]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </p>
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-[#F2EAE0] bg-[#f9f1e3] px-4 py-3 text-sm text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Returns
            </p>
            <p className="mt-2 text-xs text-slate-600">{returnMessage}</p>
            <a
              href={returnMailto}
              className={`mt-3 inline-flex w-full items-center justify-center rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${returnButtonClasses}`}
              aria-disabled={order.returnEligible ? "false" : "true"}
            >
              Request a return
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
