import {
  FiHome,
  FiMessageSquare,
  FiShoppingBag,
  FiPackage,
  FiUserCheck,
  FiPieChart,
  FiTag,
} from "react-icons/fi";

export const adminLinks = [
  { label: "Dashboard", to: "/admin/dashboard", icon: FiHome },
  { label: "Reviews", to: "/admin/reviews", icon: FiMessageSquare },
  { label: "Orders", to: "/admin/orders", icon: FiShoppingBag },
  { label: "Products", to: "/admin/products", icon: FiPackage },
  { label: "Customers", to: "/admin/customers", icon: FiUserCheck },
  { label: "Coupons", to: "/admin/coupons", icon: FiTag },
  { label: "Reports", to: "/admin/reports", icon: FiPieChart },
];

export default adminLinks;
