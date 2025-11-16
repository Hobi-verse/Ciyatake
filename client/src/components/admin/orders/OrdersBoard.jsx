import { useEffect, useMemo, useState } from "react";
import {
  fetchAdminOrders,
  updateAdminOrderStatus,
} from "../../../api/admin.js";
import formatINR from "../../../utils/currency.js";
import Loader from "../../common/Loader.jsx";
import Skeleton from "../../common/Skeleton.jsx";

const statusClassMap = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-sky-100 text-sky-700",
  processing: "bg-amber-100 text-amber-700",
  packed: "bg-slate-200 text-slate-700",
  shipped: "bg-blue-100 text-blue-700",
  "out-for-delivery": "bg-indigo-100 text-indigo-700",
  delivered: "bg-[#e6f1e6] text-[#4f7a5a]",
  cancelled: "bg-rose-100 text-rose-700",
  refunded: "bg-slate-200 text-slate-700",
};

const ORDER_STATUS_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["packed", "cancelled"],
  packed: ["shipped", "cancelled"],
  shipped: ["out-for-delivery"],
  "out-for-delivery": ["delivered"],
  delivered: [],
  cancelled: ["refunded"],
  refunded: [],
};

const STATUS_LABEL_OVERRIDES = {
  shipped: "In Transit",
};

const formatStatusLabel = (status) => {
  if (!status) {
    return "Unknown";
  }

  const normalized = status.toString().toLowerCase();
  if (STATUS_LABEL_OVERRIDES[normalized]) {
    return STATUS_LABEL_OVERRIDES[normalized];
  }

  return normalized
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDateLabel = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatCurrency = (value) =>
  typeof value === "number" && Number.isFinite(value) ? formatINR(value) : "—";

const formatAddress = (shipping) => {
  if (!shipping) {
    return "No shipping address on file.";
  }

  const parts = [
    shipping.recipient,
    shipping.addressLine1,
    shipping.addressLine2,
    [shipping.city, shipping.state].filter(Boolean).join(", "),
    shipping.postalCode,
    shipping.country ?? "India",
  ]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean);

  if (!parts.length) {
    return "No shipping address on file.";
  }

  return parts.join("\n");
};

const computeAvailableStatuses = (currentStatus) => {
  if (!currentStatus) {
    return [];
  }

  return ORDER_STATUS_TRANSITIONS[currentStatus] ?? [];
};

const OrderStatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
      statusClassMap[status] ?? "bg-slate-200 text-slate-700"
    }`}
  >
    {formatStatusLabel(status)}
  </span>
);

const OrderListSkeleton = () => (
  <tbody className="divide-y divide-[#f2eae0] text-sm">
    {Array.from({ length: 6 }).map((_, index) => (
      <tr key={`orders-skeleton-${index}`} className="animate-pulse">
        <td className="px-5 py-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-3 w-16" />
        </td>
        <td className="px-5 py-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="mt-2 h-3 w-20" />
        </td>
        <td className="px-5 py-4">
          <Skeleton className="h-4 w-24" />
        </td>
        <td className="px-5 py-4">
          <Skeleton className="h-4 w-20" />
        </td>
        <td className="px-5 py-4">
          <Skeleton className="h-4 w-20" />
        </td>
      </tr>
    ))}
  </tbody>
);

const OrdersList = ({ orders, loading, error, selectedId, onSelect }) => (
  <div className="overflow-hidden rounded-2xl border border-[#e6dccb] bg-white shadow-2xl">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[#f2eae0]">
        <thead className="bg-[#b8985b] text-left text-xs font-semibold uppercase tracking-wide text-white">
          <tr>
            <th className="px-5 py-4">Order</th>
            <th className="px-5 py-4">Customer</th>
            <th className="px-5 py-4">Placed</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4 text-right">Total</th>
          </tr>
        </thead>
        {error ? (
          <tbody>
            <tr>
              <td
                colSpan={5}
                className="px-5 py-6 text-center text-sm text-rose-600"
              >
                Unable to load orders.
              </td>
            </tr>
          </tbody>
        ) : loading ? (
          <OrderListSkeleton />
        ) : orders.length ? (
          <tbody className="divide-y divide-[#f2eae0] text-sm">
            {orders.map((order) => {
              const isSelected = order.id === selectedId;
              return (
                <tr
                  key={order.id ?? order.orderNumber}
                  className={`cursor-pointer transition hover:bg-[#f2eae0] ${
                    isSelected ? "bg-[#f6efe3]" : ""
                  }`}
                  onClick={() => onSelect(order.id)}
                >
                  <td className="px-5 py-4">
                    <div className="font-semibold text-[#8f7843]">
                      {order.orderNumber || order.id || "—"}
                    </div>
                    {typeof order.itemsCount === "number" && (
                      <div className="text-xs text-slate-500">
                        {order.itemsCount} item{order.itemsCount === 1 ? "" : "s"}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-700">
                      {order.customerName || "—"}
                    </div>
                    {order.customerEmail && (
                      <div className="text-xs text-slate-500">
                        {order.customerEmail}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {formatDateLabel(order.placedAt)}
                  </td>
                  <td className="px-5 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-slate-700">
                    {formatCurrency(
                      order.pricing?.grandTotal ?? order.grandTotal
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td
                colSpan={5}
                className="px-5 py-6 text-center text-sm text-slate-500"
              >
                No orders found.
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  </div>
);

const OrderItemsTable = ({ items }) => {
  if (!items?.length) {
    return (
      <div className="rounded-xl border border-dashed border-[#e6dccb] bg-[#fdf8ee] px-5 py-4 text-sm text-slate-500">
        No products attached to this order yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#e6dccb]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#f2eae0]">
          <thead className="bg-[#f9f1e3] text-left text-xs font-semibold uppercase tracking-wide text-[#8f7843]">
            <tr>
              <th className="px-5 py-3">Item</th>
              <th className="px-5 py-3">Variant</th>
              <th className="px-5 py-3 text-center">Qty</th>
              <th className="px-5 py-3 text-right">Unit Price</th>
              <th className="px-5 py-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2eae0] text-sm">
            {items.map((item) => (
              <tr key={item.id ?? `${item.productId}-${item.variantSku}`}>
                <td className="px-5 py-4">
                  <div className="font-medium text-slate-700">
                    {item.title || "—"}
                  </div>
                  {item.variantSku && (
                    <div className="text-xs text-slate-400">
                      SKU: {item.variantSku}
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 text-sm text-slate-500">
                  {[item.size, item.color].filter(Boolean).join(" · ") || "—"}
                </td>
                <td className="px-5 py-4 text-center text-sm text-slate-600">
                  {item.quantity ?? "—"}
                </td>
                <td className="px-5 py-4 text-right text-sm text-slate-600">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="px-5 py-4 text-right font-semibold text-slate-700">
                  {formatCurrency(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatusUpdateForm = ({ order, onSubmit, isUpdating, submitError }) => {
  const [nextStatus, setNextStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierService, setCourierService] = useState("");

  const options = useMemo(
    () => computeAvailableStatuses(order?.status ?? ""),
    [order?.status]
  );

  useEffect(() => {
    const firstOption = options[0] ?? "";
    setNextStatus(firstOption);
    setTrackingNumber(order?.delivery?.trackingNumber ?? "");
    setCourierService(order?.delivery?.courierService ?? "");
  }, [
    order?.id,
    order?.delivery?.courierService,
    order?.delivery?.trackingNumber,
    options,
  ]);

  if (!order) {
    return null;
  }

  if (!options.length) {
    return (
      <div className="rounded-xl border border-[#e6dccb] bg-[#fdf8ee] px-5 py-4 text-sm text-slate-500">
        No further manual status updates available for this order.
      </div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!nextStatus || isUpdating) {
      return;
    }

    onSubmit({ status: nextStatus, trackingNumber, courierService });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-[#e6dccb] bg-[#fdf8ee] px-5 py-5"
    >
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-[#8f7843]">
          Progress Order Status
        </label>
        <select
          value={nextStatus}
          onChange={(event) => setNextStatus(event.target.value)}
          className="mt-2 w-full rounded-lg border border-[#e6dccb] bg-white px-3 py-2 text-sm text-slate-700 focus:border-[#b8985b] focus:outline-none focus:ring-2 focus:ring-[#e5d3b4]"
          disabled={isUpdating}
        >
          {options.map((status) => (
            <option key={status} value={status}>
              {formatStatusLabel(status)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-[#8f7843]">
            Tracking Number
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
            className="mt-2 w-full rounded-lg border border-[#e6dccb] px-3 py-2 text-sm text-slate-700 focus:border-[#b8985b] focus:outline-none focus:ring-2 focus:ring-[#e5d3b4]"
            placeholder="Optional"
            disabled={isUpdating}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-[#8f7843]">
            Courier Service
          </label>
          <input
            type="text"
            value={courierService}
            onChange={(event) => setCourierService(event.target.value)}
            className="mt-2 w-full rounded-lg border border-[#e6dccb] px-3 py-2 text-sm text-slate-700 focus:border-[#b8985b] focus:outline-none focus:ring-2 focus:ring-[#e5d3b4]"
            placeholder="Optional"
            disabled={isUpdating}
          />
        </div>
      </div>

      {submitError ? (
        <div className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
          {submitError}
        </div>
      ) : null}

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-[#8f7843] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7b6636] disabled:cursor-not-allowed disabled:bg-[#d4c5a6]"
        disabled={isUpdating || !nextStatus}
      >
        {isUpdating ? "Updating status..." : "Update Status"}
      </button>
    </form>
  );
};

const OrderDetailsPanel = ({
  order,
  isUpdatingStatus,
  statusError,
  onStatusUpdate,
}) => {
  if (!order) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-[#e6dccb] bg-white px-6 py-10 text-sm text-slate-500 shadow-2xl">
        Select an order to view full details.
      </div>
    );
  }

  return (
    <div className="flex max-h-[calc(100vh-300px)] flex-col gap-5 overflow-y-auto rounded-2xl border border-[#e6dccb] bg-white p-6 shadow-2xl">
      <div className="flex flex-col gap-2 border-b border-[#f2eae0] pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-2xl font-semibold text-slate-900">
            Order {order.orderNumber || order.id}
          </h3>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span>Placed {formatDateLabel(order.placedAt)}</span>
          {order.payment?.method && (
            <span>Payment: {formatStatusLabel(order.payment.method)}</span>
          )}
          {order.payment?.status && (
            <span className="inline-flex items-center rounded-full bg-[#f2eae0] px-2 py-0.5 text-xs font-semibold text-[#8f7843]">
              {formatStatusLabel(order.payment.status)}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-[#f2eae0] bg-[#fefaf3] p-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-[#8f7843]">
            Customer
          </h4>
          <div className="text-sm text-slate-700">
            <div className="font-medium text-slate-800">
              {order.customerName || "—"}
            </div>
            <div className="break-words">{order.customerEmail || "No email on file"}</div>
            {order.customerPhone ? (
              <div className="text-sm text-slate-500">
                Phone: {order.customerPhone}
              </div>
            ) : null}
          </div>
        </div>
        <div className="space-y-3 rounded-xl border border-[#f2eae0] bg-[#fefaf3] p-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-[#8f7843]">
            Shipping Address
          </h4>
          <pre className="whitespace-pre-wrap break-words text-sm text-slate-700">
            {formatAddress(order.shipping)}
          </pre>
          {order.shipping?.phone && (
            <div className="text-xs text-slate-500">
              Contact: {order.shipping.phone}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-[#8f7843]">
            Order Items
          </h4>
          <div className="text-sm text-slate-500">
            Subtotal {formatCurrency(order.pricing?.subtotal)} · Grand Total{" "}
            <span className="font-semibold text-slate-700">
              {formatCurrency(order.pricing?.grandTotal ?? order.grandTotal)}
            </span>
          </div>
        </div>
        <OrderItemsTable items={order.items} />
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-[#8f7843]">
          Delivery Progress
        </h4>
        <div className="space-y-2 rounded-xl border border-[#f2eae0] bg-[#fefaf3] p-4 text-sm text-slate-700">
          {order.timeline?.length ? (
            order.timeline.map((entry) => (
              <div
                key={entry.id ?? `${entry.title}-${entry.timestamp}`}
                className="flex flex-col gap-1 rounded-lg border border-[#f2eae0] bg-white px-3 py-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-slate-800">
                    {entry.title}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatDateLabel(entry.timestamp)}
                  </span>
                </div>
                {entry.description ? (
                  <p className="break-words text-xs text-slate-500">{entry.description}</p>
                ) : null}
              </div>
            ))
          ) : (
            <div>No timeline updates logged for this order yet.</div>
          )}
          <div className="rounded-lg border border-dashed border-[#e6dccb] bg-white px-3 py-2 text-xs text-slate-500">
            Tracking: {order.delivery?.trackingNumber || "Not assigned"} ·
            Courier: {order.delivery?.courierService || "Not set"}
          </div>
        </div>
      </div>

      <StatusUpdateForm
        order={order}
        onSubmit={onStatusUpdate}
        isUpdating={isUpdatingStatus}
        submitError={statusError}
      />
    </div>
  );
};

const OrdersBoard = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [statusError, setStatusError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;

    const initialise = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchAdminOrders({ limit: 25 });
        if (!isMounted) {
          return;
        }

        const nextOrders = Array.isArray(response?.results)
          ? response.results
          : [];

        setOrders(nextOrders);
        setPagination(response?.pagination ?? null);
        setSelectedId(nextOrders[0]?.id ?? null);
      } catch (apiError) {
        if (isMounted) {
          setError(apiError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initialise();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedId) ?? null,
    [orders, selectedId]
  );

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") {
      return orders;
    }
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = {
      all: orders.length,
      processing: 0,
      delivered: 0,
      refunded: 0,
      cancelled: 0,
      pending: 0,
      confirmed: 0,
      shipped: 0,
    };

    orders.forEach((order) => {
      if (counts.hasOwnProperty(order.status)) {
        counts[order.status]++;
      }
    });

    return counts;
  }, [orders]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetchAdminOrders({ limit: 25 });
      const nextOrders = Array.isArray(response?.results)
        ? response.results
        : [];

      setOrders(nextOrders);
      setPagination(response?.pagination ?? null);
      if (!nextOrders.find((order) => order.id === selectedId)) {
        setSelectedId(nextOrders[0]?.id ?? null);
      }
    } catch (apiError) {
      setError(apiError);
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatusUpdate = async ({
    status,
    trackingNumber,
    courierService,
  }) => {
    if (!selectedOrder || !status) {
      return;
    }

    setUpdatingStatus(true);
    setStatusError(null);

    try {
      const update = await updateAdminOrderStatus(selectedOrder.id, {
        status,
        trackingNumber,
        courierService,
      });

      if (update) {
        setOrders((current) =>
          current.map((order) =>
            order.id === selectedOrder.id
              ? {
                  ...order,
                  status: update.status ?? order.status,
                  delivery: update.delivery ?? order.delivery,
                  timeline: update.timeline?.length
                    ? update.timeline
                    : order.timeline,
                }
              : order
          )
        );
      }
    } catch (apiError) {
      setStatusError(apiError?.payload?.message ?? "Unable to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const totalOrders = useMemo(() => {
    if (pagination?.totalOrders) {
      return pagination.totalOrders;
    }

    return orders.length;
  }, [orders.length, pagination]);

  return (
    <section className="space-y-7 text-slate-800">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Orders</h2>
          <p className="text-base text-slate-500">
            Review order activity, customer details, and delivery progress in
            one place.
          </p>
          <div className="text-sm text-slate-400">
            {loading ? (
              <Skeleton className="h-4 w-56" />
            ) : (
              <span>
                Showing {filteredOrders.length} of {totalOrders} orders
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-[#e6dccb] px-4 py-2 text-sm font-semibold text-[#8f7843] shadow-sm transition hover:border-[#b8985b] hover:bg-[#fff8ec] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleRefresh}
            disabled={loading || refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {/* Filter Section */}
      <div className="rounded-2xl border border-[#e6dccb] bg-white p-5 shadow-lg">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#8f7843]">
          Filter by Status
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          <button
            onClick={() => setStatusFilter("all")}
            className={`flex flex-col items-center justify-center rounded-xl border-2 px-4 py-3 transition-all duration-200 ${
              statusFilter === "all"
                ? "border-[#b8985b] bg-[#fff8ec] shadow-md"
                : "border-[#e6dccb] bg-white hover:border-[#d4c5a6] hover:bg-[#fefaf3]"
            }`}
          >
            <span className="text-2xl font-bold text-[#8f7843]">
              {statusCounts.all}
            </span>
            <span className="mt-1 text-xs font-semibold text-slate-600">
              All Orders
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("pending")}
            className={`flex flex-col items-center justify-center rounded-xl border-2 px-4 py-3 transition-all duration-200 ${
              statusFilter === "pending"
                ? "border-amber-400 bg-amber-50 shadow-md"
                : "border-[#e6dccb] bg-white hover:border-amber-200 hover:bg-amber-50"
            }`}
          >
            <span className="text-2xl font-bold text-amber-600">
              {statusCounts.pending}
            </span>
            <span className="mt-1 text-xs font-semibold text-slate-600">
              Pending
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("confirmed")}
            className={`flex flex-col items-center justify-center rounded-xl border-2 px-4 py-3 transition-all duration-200 ${
              statusFilter === "confirmed"
                ? "border-sky-400 bg-sky-50 shadow-md"
                : "border-[#e6dccb] bg-white hover:border-sky-200 hover:bg-sky-50"
            }`}
          >
            <span className="text-2xl font-bold text-sky-600">
              {statusCounts.confirmed}
            </span>
            <span className="mt-1 text-xs font-semibold text-slate-600">
              Confirmed
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("processing")}
            className={`flex flex-col items-center justify-center rounded-xl border-2 px-4 py-3 transition-all duration-200 ${
              statusFilter === "processing"
                ? "border-amber-400 bg-amber-50 shadow-md"
                : "border-[#e6dccb] bg-white hover:border-amber-200 hover:bg-amber-50"
            }`}
          >
            <span className="text-2xl font-bold text-amber-600">
              {statusCounts.processing}
            </span>
            <span className="mt-1 text-xs font-semibold text-slate-600">
              Processing
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("shipped")}
            className={`flex flex-col items-center justify-center rounded-xl border-2 px-4 py-3 transition-all duration-200 ${
              statusFilter === "shipped"
                ? "border-blue-400 bg-blue-50 shadow-md"
                : "border-[#e6dccb] bg-white hover:border-blue-200 hover:bg-blue-50"
            }`}
          >
            <span className="text-2xl font-bold text-blue-600">
              {statusCounts.shipped}
            </span>
            <span className="mt-1 text-xs font-semibold text-slate-600">
              In Transit
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("delivered")}
            className={`flex flex-col items-center justify-center rounded-xl border-2 px-4 py-3 transition-all duration-200 ${
              statusFilter === "delivered"
                ? "border-green-400 bg-green-50 shadow-md"
                : "border-[#e6dccb] bg-white hover:border-green-200 hover:bg-green-50"
            }`}
          >
            <span className="text-2xl font-bold text-green-600">
              {statusCounts.delivered}
            </span>
            <span className="mt-1 text-xs font-semibold text-slate-600">
              Delivered
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("cancelled")}
            className={`flex flex-col items-center justify-center rounded-xl border-2 px-4 py-3 transition-all duration-200 ${
              statusFilter === "cancelled"
                ? "border-rose-400 bg-rose-50 shadow-md"
                : "border-[#e6dccb] bg-white hover:border-rose-200 hover:bg-rose-50"
            }`}
          >
            <span className="text-2xl font-bold text-rose-600">
              {statusCounts.cancelled}
            </span>
            <span className="mt-1 text-xs font-semibold text-slate-600">
              Cancelled
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("refunded")}
            className={`flex flex-col items-center justify-center rounded-xl border-2 px-4 py-3 transition-all duration-200 ${
              statusFilter === "refunded"
                ? "border-slate-400 bg-slate-50 shadow-md"
                : "border-[#e6dccb] bg-white hover:border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="text-2xl font-bold text-slate-600">
              {statusCounts.refunded}
            </span>
            <span className="mt-1 text-xs font-semibold text-slate-600">
              Refunded
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_1fr]">
        <div className="min-w-0">
          <OrdersList
            orders={filteredOrders}
            loading={loading}
            error={error}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        <div className="min-w-0">
          <OrderDetailsPanel
            order={selectedOrder}
            isUpdatingStatus={updatingStatus}
            statusError={statusError}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      </div>

      {loading && !orders.length ? (
        <div className="flex justify-center pt-6">
          <Loader label="Fetching orders" />
        </div>
      ) : null}
    </section>
  );
};

export default OrdersBoard;
