import cartJson from "../data/cart.json";
import checkoutJson from "../data/checkout.json";
import confirmationJson from "../data/confirmation.json";
import productsJson from "../data/products.json";
import wishlistJson from "../data/wishlist.json";
import { getProductDetailById } from "../data/productDetail.js";

const clone = (value) => {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
};

export const getMockProducts = async () => clone(productsJson);

export const getMockProductDetail = async (productId) =>
  clone(getProductDetailById(productId));

export const getMockCart = async () => clone(cartJson);

export const getMockWishlist = async () => clone(wishlistJson);

export const getMockCheckoutSummary = async () => clone(checkoutJson);

export const getMockOrderConfirmation = async () => clone(confirmationJson);

export const getMockDashboardMetrics = async () => ({
  totals: {
    sales: 120000,
    trend: 0.14,
  },
  newOrders: {
    count: 35,
    awaitingFulfilment: 8,
  },
  topProduct: {
    name: "Eco-Friendly Water Bottle",
    unitsSold: 620,
  },
});

export const getMockRecentOrders = async () => [
  { id: "#1001", customer: "Emily Carter", date: "2023-11-15", status: "Shipped" },
  { id: "#1002", customer: "David Lee", date: "2023-11-14", status: "Processing" },
  { id: "#1003", customer: "Olivia Brown", date: "2023-11-13", status: "Completed" },
];

export const getMockRecentActivities = async () => [
  {
    icon: "🛒",
    message: "New order #1006 was placed.",
    timestamp: "2 minutes ago",
  },
  {
    icon: "👤",
    message: "New user registered: Alex Johnson.",
    timestamp: "45 minutes ago",
  },
  {
    icon: "⚠️",
    message: "Low stock alert for Bamboo Toothbrush.",
    timestamp: "2 hours ago",
  },
  {
    icon: "🛒",
    message: "New order #1005 was placed.",
    timestamp: "Yesterday",
  },
];

export const getMockProductSummaries = async () => [
  { id: 1, name: "Eco-Friendly Water Bottle", price: "$25.00", stock: 120 },
  { id: 2, name: "Reusable Bamboo Cutlery", price: "$15.00", stock: 80 },
  { id: 3, name: "Organic Cotton Tote Bag", price: "$18.00", stock: 45 },
];

export const getMockCustomers = async () => [
  { id: 1, name: "Emily Carter", email: "emily.carter@example.com", joined: "Jan 12, 2023" },
  { id: 2, name: "David Lee", email: "david.lee@example.com", joined: "Mar 03, 2023" },
  { id: 3, name: "Olivia Brown", email: "olivia.brown@example.com", joined: "Jul 21, 2023" },
];

export const getMockReports = async () => [
  {
    id: 1,
    title: "Monthly Sales Summary",
    summary: "Overall sales increased by 12% compared to the previous month.",
  },
  {
    id: 2,
    title: "Inventory Insights",
    summary: "Five products are nearing low stock levels. Consider restocking soon.",
  },
  {
    id: 3,
    title: "Customer Engagement",
    summary: "Email campaign open rates improved by 8% week-over-week.",
  },
];

export const getMockAdminUsers = async () => [
  { id: 1, name: "Sarah Chen", role: "Admin", lastActive: "5 minutes ago" },
  { id: 2, name: "James Wilson", role: "Manager", lastActive: "30 minutes ago" },
  { id: 3, name: "Ava Patel", role: "Support", lastActive: "1 hour ago" },
];
