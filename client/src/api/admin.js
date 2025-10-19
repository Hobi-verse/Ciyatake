import { apiRequest } from "./client";

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

const normalizeOrderStatus = (status) =>
  typeof status === "string" && status.trim().length
    ? status.trim().toLowerCase()
    : "unknown";

const normalizeAdminOrder = (order) => {
  if (!order || typeof order !== "object") {
    return null;
  }

  const resolvedCustomer = (() => {
    if (order.customer && typeof order.customer === "object") {
      const customerId =
        order.customer.id ?? order.customer._id ?? order.customer.userId ?? null;
      return {
        id:
          typeof customerId === "string"
            ? customerId
            : customerId?.toString?.() ?? null,
        name: order.customer.name ?? order.customer.fullName ?? null,
        email: order.customer.email ?? null,
        phone:
          order.customer.phone ??
          order.customer.mobileNumber ??
          order.customer.contact ??
          null,
      };
    }

    if (order.customerName || order.customerEmail || order.customerPhone) {
      const customerId = order.customerId ?? null;
      return {
        id:
          typeof customerId === "string"
            ? customerId
            : customerId?.toString?.() ?? null,
        name: order.customerName ?? null,
        email: order.customerEmail ?? null,
        phone: order.customerPhone ?? null,
      };
    }

    if (order.user && typeof order.user === "object") {
      const userId = order.user.id ?? order.user._id ?? null;
      return {
        id:
          typeof userId === "string"
            ? userId
            : userId?.toString?.() ?? null,
        name: order.user.fullName ?? order.user.name ?? null,
        email: order.user.email ?? null,
        phone: order.user.mobileNumber ?? order.user.phone ?? null,
      };
    }

    return {
      id: null,
      name: null,
      email: null,
      phone: null,
    };
  })();

  const normalizedItems = Array.isArray(order.items)
    ? order.items.map((item) => ({
      id: (() => {
        const identifier = item.id ?? item._id ?? null;
        return typeof identifier === "string"
          ? identifier
          : identifier?.toString?.() ?? null;
      })(),
      productId: (() => {
        const identifier =
          item.productId ?? item.product?.id ?? item.product?._id ?? null;
        return typeof identifier === "string"
          ? identifier
          : identifier?.toString?.() ?? null;
      })(),
      variantSku: item.variantSku ?? item.sku ?? null,
      title: item.title ?? item.product?.title ?? "",
      size: item.size ?? item.variant?.size ?? null,
      color: item.color ?? item.variant?.color ?? null,
      unitPrice: typeof item.unitPrice === "number" ? item.unitPrice : null,
      quantity: typeof item.quantity === "number" ? item.quantity : null,
      subtotal:
        typeof item.subtotal === "number"
          ? item.subtotal
          : typeof item.total === "number"
            ? item.total
            : null,
      imageUrl:
        item.imageUrl ??
        item.product?.imageUrl ??
        (Array.isArray(item.product?.media)
          ? item.product.media[0]?.url ?? null
          : null),
    }))
    : [];

  const pricing =
    order.pricing && typeof order.pricing === "object"
      ? {
        subtotal:
          typeof order.pricing.subtotal === "number"
            ? order.pricing.subtotal
            : null,
        shipping:
          typeof order.pricing.shipping === "number"
            ? order.pricing.shipping
            : null,
        tax:
          typeof order.pricing.tax === "number" ? order.pricing.tax : null,
        discount:
          typeof order.pricing.discount === "number"
            ? order.pricing.discount
            : null,
        grandTotal:
          typeof order.pricing.grandTotal === "number"
            ? order.pricing.grandTotal
            : null,
      }
      : {
        subtotal:
          typeof order.subtotal === "number" ? order.subtotal : null,
        shipping:
          typeof order.shippingCost === "number"
            ? order.shippingCost
            : null,
        tax: typeof order.tax === "number" ? order.tax : null,
        discount:
          typeof order.discount === "number" ? order.discount : null,
        grandTotal:
          typeof order.grandTotal === "number"
            ? order.grandTotal
            : typeof order.total === "number"
              ? order.total
              : null,
      };

  const shipping = (() => {
    if (order.shipping && typeof order.shipping === "object") {
      return {
        recipient: order.shipping.recipient ?? null,
        phone: order.shipping.phone ?? null,
        addressLine1: order.shipping.addressLine1 ?? null,
        addressLine2: order.shipping.addressLine2 ?? null,
        city: order.shipping.city ?? null,
        state: order.shipping.state ?? null,
        postalCode: order.shipping.postalCode ?? null,
        country: order.shipping.country ?? null,
        instructions: order.shipping.instructions ?? null,
      };
    }

    if (order.shippingRecipient || order.shippingCity) {
      return {
        recipient: order.shippingRecipient ?? null,
        city: order.shippingCity ?? null,
      };
    }

    return null;
  })();

  const delivery =
    order.delivery && typeof order.delivery === "object"
      ? {
        estimatedDeliveryDate: toISOStringSafe(
          order.delivery.estimatedDeliveryDate
        ),
        deliveryWindow: order.delivery.deliveryWindow ?? null,
        actualDeliveryDate: toISOStringSafe(order.delivery.actualDeliveryDate),
        trackingNumber: order.delivery.trackingNumber ?? null,
        courierService: order.delivery.courierService ?? null,
      }
      : null;

  const timeline = Array.isArray(order.timeline)
    ? order.timeline.map((entry) => ({
      id: (() => {
        const identifier = entry.id ?? entry._id ?? null;
        return typeof identifier === "string"
          ? identifier
          : identifier?.toString?.() ?? null;
      })(),
      title: entry.title ?? "",
      description: entry.description ?? "",
      status: entry.status ?? null,
      timestamp: toISOStringSafe(entry.timestamp),
    }))
    : [];

  const paymentStatus = order.payment?.status ?? order.paymentStatus ?? null;
  const paymentMethod = order.payment?.method ?? order.paymentMethod ?? null;
  const itemsCount =
    typeof order.itemsCount === "number"
      ? order.itemsCount
      : Array.isArray(order.items)
        ? order.items.length
        : normalizedItems.length;

  const resolvedId = order.id ?? order.orderNumber ?? order._id ?? null;
  const normalizedId =
    typeof resolvedId === "string"
      ? resolvedId
      : resolvedId?.toString?.() ?? null;

  return {
    id: normalizedId,
    orderNumber:
      typeof order.orderNumber === "string"
        ? order.orderNumber
        : typeof order.id === "string"
          ? order.id
          : normalizedId ?? "",
    status: normalizeOrderStatus(order.status),
    placedAt: toISOStringSafe(order.placedAt ?? order.createdAt),
    updatedAt: toISOStringSafe(order.updatedAt),
    grandTotal:
      typeof order.grandTotal === "number"
        ? order.grandTotal
        : typeof order.pricing?.grandTotal === "number"
          ? order.pricing.grandTotal
          : null,
    discount:
      typeof order.discount === "number"
        ? order.discount
        : typeof order.pricing?.discount === "number"
          ? order.pricing.discount
          : null,
    paymentStatus,
    paymentMethod,
    itemsCount,
    customerName:
      resolvedCustomer.name ??
      order.customerName ??
      (typeof order.customer === "string" ? order.customer : null),
    customerEmail: resolvedCustomer.email ?? null,
    customerPhone: resolvedCustomer.phone ?? null,
    customer: resolvedCustomer,
    items: normalizedItems,
    pricing,
    payment: {
      method: paymentMethod,
      status: paymentStatus,
      transactionId: order.payment?.transactionId ?? null,
      paidAt: toISOStringSafe(order.payment?.paidAt),
    },
    shipping,
    delivery,
    timeline,
    notes: order.notes && typeof order.notes === "object" ? order.notes : {},
    support:
      order.support && typeof order.support === "object"
        ? order.support
        : null,
  };
};

const normalizeAdminCustomer = (customer) => {
  if (!customer || typeof customer !== "object") {
    return null;
  }

  return {
    id: customer.id ?? customer._id ?? null,
    userId: customer.userId ?? null,
    name: customer.name ?? "",
    email: customer.email ?? "",
    phone: customer.phone ?? null,
    membershipTier: customer.membershipTier ?? null,
    totalOrders:
      typeof customer.totalOrders === "number" ? customer.totalOrders : 0,
    totalSpent:
      typeof customer.totalSpent === "number" ? customer.totalSpent : 0,
    rewardPoints:
      typeof customer.rewardPoints === "number" ? customer.rewardPoints : 0,
    walletBalance:
      typeof customer.walletBalance === "number"
        ? customer.walletBalance
        : 0,
    lastUpdated: toISOStringSafe(customer.lastUpdated),
    joinedAt: toISOStringSafe(customer.joinedAt ?? customer.userCreatedAt),
    isVerified: Boolean(customer.isVerified),
  };
};

export const fetchDashboardMetrics = async () => {
  const response = await apiRequest("/admin/dashboard/metrics");
  return response?.data ?? response ?? {};
};

export const fetchRecentOrders = async (params = {}) => {
  const query = {
    limit: 10,
    sortBy: "placedAt",
    sortOrder: "desc",
    ...params,
  };

  const response = await apiRequest("/search/admin/orders", { query });
  const data = response?.data ?? {};
  const pagination = response?.pagination ?? null;

  const results = Array.isArray(data.results)
    ? data.results.map((order) => normalizeAdminOrder(order)).filter(Boolean)
    : [];

  return {
    results,
    pagination,
    stats: Array.isArray(data.stats) ? data.stats : [],
    query: data.query ?? "",
    source: "api",
  };
};

export const fetchAdminOrders = async (params = {}) => {
  const query = {
    limit: 20,
    sortBy: "placedAt",
    sortOrder: "desc",
    ...params,
  };

  const payload = await apiRequest("/orders/admin/all", { query });
  const data = payload?.data ?? {};

  const results = Array.isArray(data.orders)
    ? data.orders.map((order) => normalizeAdminOrder(order)).filter(Boolean)
    : [];

  return {
    results,
    pagination: data.pagination ?? null,
  };
};

export const updateAdminOrderStatus = async (
  orderId,
  { status, trackingNumber, courierService }
) => {
  if (!orderId) {
    throw new Error("updateAdminOrderStatus requires an orderId");
  }

  if (!status) {
    throw new Error("updateAdminOrderStatus requires a status string");
  }

  const response = await apiRequest(`/orders/${orderId}/status`, {
    method: "PATCH",
    body: {
      status,
      trackingNumber: trackingNumber || undefined,
      courierService: courierService || undefined,
    },
  });

  const orderData = response?.data?.order ?? response?.order ?? null;
  if (!orderData) {
    return null;
  }

  return {
    status: normalizeOrderStatus(orderData.status),
    delivery:
      orderData.delivery && typeof orderData.delivery === "object"
        ? {
          estimatedDeliveryDate: toISOStringSafe(
            orderData.delivery.estimatedDeliveryDate
          ),
          deliveryWindow: orderData.delivery.deliveryWindow ?? null,
          actualDeliveryDate: toISOStringSafe(
            orderData.delivery.actualDeliveryDate
          ),
          trackingNumber: orderData.delivery.trackingNumber ?? null,
          courierService: orderData.delivery.courierService ?? null,
        }
        : null,
    timeline: Array.isArray(orderData.timeline)
      ? orderData.timeline.map((entry) => ({
        id: entry.id ?? entry._id ?? null,
        title: entry.title ?? "",
        description: entry.description ?? "",
        status: entry.status ?? null,
        timestamp: toISOStringSafe(entry.timestamp),
      }))
      : [],
  };
};

export const fetchRecentActivities = async () => {
  const response = await apiRequest("/admin/activities");
  return response?.data ?? response ?? [];
};

export const fetchProductsSummary = async (params = {}) => {
  const query = {
    includeInactive: true,
    ...params,
  };

  const payload = await apiRequest("/products", { query });
  return Array.isArray(payload?.products) ? payload.products : [];
};

export const createProduct = async (productData) => {
  const response = await apiRequest("/products", {
    method: "POST",
    body: productData,
  });

  return response?.product ?? null;
};

export const updateProduct = async (productId, productData) => {
  if (!productId) {
    throw new Error("updateProduct requires a productId");
  }

  const response = await apiRequest(`/products/${productId}`, {
    method: "PUT",
    body: productData,
  });

  return response?.product ?? null;
};

export const deleteProduct = async (productId) => {
  if (!productId) {
    throw new Error("deleteProduct requires a productId");
  }

  return apiRequest(`/products/${productId}`, {
    method: "DELETE",
  });
};

export const updateProductStock = async (productId, payload) => {
  if (!productId) {
    throw new Error("updateProductStock requires a productId");
  }

  return apiRequest(`/products/${productId}/stock`, {
    method: "PATCH",
    body: payload,
  });
};

export const fetchCustomers = async (params = {}) => {
  const query = {
    limit: 20,
    sortBy: "recentActivity",
    sortOrder: "desc",
    ...params,
  };

  const response = await apiRequest("/search/admin/customers", { query });
  const data = response?.data ?? {};
  const pagination = response?.pagination ?? null;

  const results = Array.isArray(data.results)
    ? data.results
      .map((customer) => normalizeAdminCustomer(customer))
      .filter(Boolean)
    : [];

  return {
    results,
    pagination,
    tierDistribution: Array.isArray(data.tierDistribution)
      ? data.tierDistribution
      : [],
    query: data.query ?? "",
    source: "api",
  };
};

export const fetchReports = async () => {
  const response = await apiRequest("/admin/reports");
  return response?.data ?? response ?? [];
};

