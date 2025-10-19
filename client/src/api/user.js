import { apiRequest } from "./client";

const STATUS_LABELS = {
  pending: "Processing",
  confirmed: "Processing",
  processing: "Processing",
  packed: "Processing",
  shipped: "Out for delivery",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const toStatusLabel = (value) => {
  if (!value) {
    return "Processing";
  }

  const normalized = value.toString().toLowerCase();
  if (STATUS_LABELS[normalized]) {
    return STATUS_LABELS[normalized];
  }

  return value
    .toString()
    .split(/[-_\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const fallbackId = () => `device-${Math.random().toString(36).slice(2, 11)}`;

const toISOStringSafe = (value) => {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
};

const normalizeTrustedDevices = (devices) =>
  Array.isArray(devices)
    ? devices.map((device) => ({
      id: device.deviceId ?? device._id ?? device.id ?? fallbackId(),
      device:
        device.deviceName ?? device.device ?? device.name ?? "Trusted device",
      location: device.location ?? "—",
      lastActive: device.lastActive ?? null,
      trusted: Boolean(device.trusted ?? true),
    }))
    : [];

const pickLatestTicket = (support) => {
  if (!support || typeof support !== "object") {
    return null;
  }

  const tickets = Array.isArray(support.tickets) ? support.tickets : [];
  if (!tickets.length) {
    return null;
  }

  const latest = tickets
    .slice()
    .sort((a, b) =>
      new Date(b.updatedAt || b.createdAt || 0) -
      new Date(a.updatedAt || a.createdAt || 0)
    )[0];

  return {
    id: latest.ticketId ?? latest.id,
    subject: latest.subject,
    status: toStatusLabel(latest.status),
    updatedOn: latest.updatedAt ?? latest.createdAt ?? null,
  };
};

const normalizeAccountSummary = (response) => {
  const summary = response?.data ?? response ?? null;
  if (!summary) {
    return null;
  }

  const recentOrders = Array.isArray(summary.recentOrders)
    ? summary.recentOrders.map((order, index) => {
      const rawId = order.id ?? order.orderNumber ?? order._id ?? fallbackId();
      const normalizedId =
        typeof rawId === "string" ? rawId : rawId?.toString?.() ?? fallbackId();

      const placedOn =
        order.placedOn ?? order.placedAt ?? order.createdAt ?? null;

      const delivery = order.delivery && typeof order.delivery === "object"
        ? order.delivery
        : {};

      const shipping = order.shipping && typeof order.shipping === "object"
        ? order.shipping
        : null;

      const timeline = Array.isArray(order.timeline)
        ? order.timeline
          .map((entry, eventIndex) => ({
            id:
              entry.id ??
              entry._id ??
              `${normalizedId}-timeline-${eventIndex}`,
            title: entry.title ?? toStatusLabel(entry.status ?? ""),
            description: entry.description ?? "",
            status: entry.status ?? null,
            timestamp: toISOStringSafe(entry.timestamp),
          }))
          .sort((a, b) => {
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timeA - timeB;
          })
        : [];

      const latestTimeline = timeline[timeline.length - 1] ?? null;
      const statusRaw = order.status ?? latestTimeline?.status ?? null;
      const statusLabel = toStatusLabel(statusRaw ?? latestTimeline?.title ?? null);

      const itemsCount = (() => {
        if (typeof order.itemsCount === "number") {
          return order.itemsCount;
        }
        if (typeof order.items === "number") {
          return order.items;
        }
        if (typeof order.orderItems === "number") {
          return order.orderItems;
        }
        if (Array.isArray(order.items)) {
          return order.items.length;
        }
        return 0;
      })();

      const expectedDelivery =
        order.expectedDelivery ?? delivery.estimatedDeliveryDate ?? null;
      const deliveredOn =
        order.deliveredOn ?? delivery.actualDeliveryDate ?? null;
      const trackingNumber =
        order.trackingNumber ?? delivery.trackingNumber ?? null;
      const courierService =
        order.courierService ?? delivery.courierService ?? null;
      const returnWindowDays = order.returnWindowDays ?? 7;

      const computedReturnDeadline = (() => {
        if (!deliveredOn) {
          return null;
        }
        const deliveredDate = new Date(deliveredOn);
        if (Number.isNaN(deliveredDate.getTime())) {
          return null;
        }
        const deadline = new Date(deliveredDate);
        deadline.setDate(deadline.getDate() + returnWindowDays);
        return deadline;
      })();

      const returnEligibleUntil = toISOStringSafe(
        order.returnEligibleUntil ?? computedReturnDeadline
      );

      const returnEligible = (() => {
        if (typeof order.returnEligible === "boolean") {
          return order.returnEligible;
        }
        if (!returnEligibleUntil) {
          return false;
        }
        return new Date(returnEligibleUntil).getTime() >= Date.now();
      })();

      return {
        id: normalizedId,
        orderNumber: normalizedId,
        reference: normalizedId,
        placedOn: toISOStringSafe(placedOn),
        status: statusLabel,
        statusLabel,
        statusRaw,
        total: order.total ?? order.pricing?.grandTotal ?? 0,
        items: itemsCount,
        itemsCount,
        expectedDelivery: toISOStringSafe(expectedDelivery),
        deliveredOn: toISOStringSafe(deliveredOn),
        paymentMethod:
          order.paymentMethod ?? order.payment?.method ?? "Online payment",
        delivery: {
          estimatedDeliveryDate: toISOStringSafe(
            delivery.estimatedDeliveryDate ?? expectedDelivery
          ),
          actualDeliveryDate: toISOStringSafe(deliveredOn),
          deliveryWindow: delivery.deliveryWindow ?? null,
          trackingNumber,
          courierService,
        },
        shipping,
        trackingNumber,
        courierService,
        timeline,
        returnEligible,
        returnEligibleUntil,
        returnWindowDays,
      };
    })
    : [];

  const security = summary.security
    ? {
      ...summary.security,
      trustedDevices: normalizeTrustedDevices(summary.security.trustedDevices),
    }
    : null;

  const support = summary.support
    ? {
      ...summary.support,
      lastTicket: pickLatestTicket(summary.support) ?? undefined,
    }
    : null;

  const profile = summary.profile
    ? {
      ...summary.profile,
      birthday: summary.profile.birthday ?? null,
      avatar: summary.profile.avatar ?? null,
    }
    : null;

  return {
    ...summary,
    profile,
    recentOrders,
    addresses: Array.isArray(summary.addresses) ? summary.addresses : [],
    paymentMethods: Array.isArray(summary.paymentMethods)
      ? summary.paymentMethods
      : [],
    security,
    support,
    preferences: summary.preferences ?? {},
  };
};

export const fetchAccountSummary = async ({ signal } = {}) => {
  const response = await apiRequest("/profile/summary", { signal });
  return normalizeAccountSummary(response);
};

export const updateAccountPreferences = async (preferences) =>
  apiRequest("/profile/preferences", {
    method: "PATCH",
    body: preferences,
  }).then((response) => response?.data?.preferences ?? preferences);

export const updateAccountProfile = async (profile) =>
  apiRequest("/profile", {
    method: "PUT",
    body: profile,
  }).then((response) => response?.data?.profile ?? null);
