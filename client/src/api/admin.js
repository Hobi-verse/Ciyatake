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
  const payload = await apiRequest("/products", { query: params });
  return Array.isArray(payload?.products) ? payload.products : [];
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
