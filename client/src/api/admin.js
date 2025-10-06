import { apiRequest, withApiFallback } from "./client";
import {
  getMockAdminUsers,
  getMockCustomers,
  getMockDashboardMetrics,
  getMockRecentActivities,
  getMockRecentOrders,
  getMockReports,
} from "./mockData";

export const fetchDashboardMetrics = async () =>
  withApiFallback(
    () => apiRequest("/admin/dashboard/metrics"),
    () => getMockDashboardMetrics()
  );

export const fetchRecentOrders = async (params = {}) =>
  withApiFallback(
    () => apiRequest("/admin/orders", { query: params }),
    () => getMockRecentOrders()
  );

export const fetchRecentActivities = async () =>
  withApiFallback(
    () => apiRequest("/admin/activities"),
    () => getMockRecentActivities()
  );

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

export const fetchCustomers = async () =>
  withApiFallback(
    () => apiRequest("/admin/customers"),
    () => getMockCustomers()
  );

export const fetchReports = async () =>
  withApiFallback(
    () => apiRequest("/admin/reports"),
    () => getMockReports()
  );

export const fetchAdminUsers = async () =>
  withApiFallback(
    () => apiRequest("/admin/users"),
    () => getMockAdminUsers()
  );
