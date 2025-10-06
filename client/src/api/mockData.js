import cartJson from "../data/cart.json";
import checkoutJson from "../data/checkout.json";
import confirmationJson from "../data/confirmation.json";
import wishlistJson from "../data/wishlist.json";

const clone = (value) => {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
};

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

export const getMockAccountSummary = async () =>
  clone({
    profile: {
      id: "usr-1024",
      name: "Aditi Sharma",
      email: "aditi.sharma@example.com",
      phone: "+91 98765 43210",
      memberSince: "2021-04-18",
      membershipTier: "Emerald",
      rewardPoints: 2840,
      walletBalance: 1250,
      nextTier: {
        name: "Sapphire Elite",
        progressPercent: 68,
        pointsNeeded: 1200,
      },
    },
    stats: [
      {
        id: "orders",
        label: "Orders placed",
        value: 24,
        trend: "+3 this year",
      },
      {
        id: "wishlist",
        label: "Wishlist items",
        value: 10,
        trend: "2 new saves",
      },
      {
        id: "credits",
        label: "Wallet credits",
        value: 1250,
        trend: "Expires 31 Mar",
      },
      {
        id: "returns",
        label: "Returns",
        value: 1,
        trend: "All resolved",
      },
    ],
    recentOrders: [
      {
        id: "CYA-2411",
        placedOn: "2024-11-28",
        status: "Out for delivery",
        total: 5423,
        items: 3,
        expectedDelivery: "2024-12-02",
        paymentMethod: "UPI •••• 3821",
      },
      {
        id: "CYA-2408",
        placedOn: "2024-11-02",
        status: "Delivered",
        total: 1780,
        items: 2,
        deliveredOn: "2024-11-06",
        paymentMethod: "Visa •••• 0932",
      },
      {
        id: "CYA-2406",
        placedOn: "2024-10-20",
        status: "Delivered",
        total: 3240,
        items: 4,
        deliveredOn: "2024-10-25",
        paymentMethod: "Wallet + COD",
      },
    ],
    addresses: [
      {
        id: "addr-1",
        label: "Home",
        recipient: "Aditi Sharma",
        phone: "+91 98765 43210",
        addressLine1: "12, Green Vista Apartments",
        addressLine2: "1st Main Road, Indiranagar",
        city: "Bengaluru",
        state: "Karnataka",
        postalCode: "560038",
        country: "India",
        isDefault: true,
      },
      {
        id: "addr-2",
        label: "Office",
        recipient: "Aditi Sharma",
        phone: "+91 98765 43210",
        addressLine1: "WeWork Prestige Cube",
        addressLine2: "Koramangala 6th Block",
        city: "Bengaluru",
        state: "Karnataka",
        postalCode: "560095",
        country: "India",
        isDefault: false,
      },
    ],
    paymentMethods: [
      {
        id: "pay-visa-0932",
        brand: "Visa",
        type: "Credit Card",
        holderName: "Aditi Sharma",
        last4: "0932",
        expiry: "07/27",
        isDefault: true,
      },
      {
        id: "pay-upi-3821",
        brand: "BHIM UPI",
        type: "UPI",
        handle: "aditi@upi",
        isDefault: false,
      },
      {
        id: "pay-wallet",
        brand: "Ciyatake Wallet",
        type: "Wallet",
        balance: 1250,
        isDefault: false,
      },
    ],
    preferences: {
      marketingEmails: true,
      smsUpdates: true,
      whatsappUpdates: false,
      orderReminders: true,
      securityAlerts: true,
    },
    security: {
      lastPasswordChange: "2024-08-14",
      twoFactorEnabled: true,
      trustedDevices: [
        {
          id: "dev-1",
          device: "OnePlus 11",
          lastActive: "Today at 8:35 PM",
          location: "Bengaluru, IN",
          trusted: true,
        },
        {
          id: "dev-2",
          device: "MacBook Air M2",
          lastActive: "Yesterday at 11:10 AM",
          location: "Bengaluru, IN",
          trusted: true,
        },
        {
          id: "dev-3",
          device: "iPad Mini",
          lastActive: "Nov 25, 6:45 PM",
          location: "Mumbai, IN",
          trusted: false,
        },
      ],
    },
    support: {
      concierge: {
        name: "Riya from Ciyatake Care",
        email: "support@ciyatake.com",
        phone: "+91 90876 54321",
        hours: "All days, 9 AM – 9 PM",
      },
      lastTicket: {
        id: "TCK-4821",
        subject: "Refund for order CYA-2404",
        status: "Resolved",
        updatedOn: "2024-10-02",
      },
    },
  });
