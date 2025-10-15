export const accountSections = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders & returns" },
  { id: "addresses", label: "Addresses" },
  { id: "payments", label: "Payments & wallet" },
  { id: "reviews", label: "My reviews" },
  { id: "preferences", label: "Security & preferences" },
];

export const orderStatusStyles = {
  "Out for delivery": "bg-[#c3dedd] text-[#2f4a55]",
  Delivered: "bg-[#F2EAE0] text-[#b8985b]",
  Processing: "bg-[#F6C7B3] text-[#8a4b3c]",
  Cancelled: "bg-rose-100 text-rose-600",
  Default: "bg-[#DCECE9] text-slate-700",
};

export const preferenceLabels = {
  marketingEmails: "Product updates & offers",
  smsUpdates: "Shipping & delivery SMS",
  whatsappUpdates: "WhatsApp alerts",
  orderReminders: "Cart reminders",
  securityAlerts: "Security alerts",
};
