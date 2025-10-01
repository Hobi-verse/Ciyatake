import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiShoppingBag,
  FiPackage,
  FiUserCheck,
  FiPieChart,
} from "react-icons/fi";

export const adminLinks = [
  { label: "Dashboard", to: "/admin/dashboard", icon: FiHome },
  { label: "Users", to: "/admin/users", icon: FiUsers },
  { label: "Orders", to: "/admin/orders", icon: FiShoppingBag },
  { label: "Products", to: "/admin/products", icon: FiPackage },
  { label: "Customers", to: "/admin/customers", icon: FiUserCheck },
  { label: "Reports", to: "/admin/reports", icon: FiPieChart },
];

const AdminSidebar = () => (
  <aside className="sticky top-24 hidden h-[calc(100vh-7.5rem)] w-72 flex-shrink-0 rounded-3xl bg-gradient-to-br from-[#0f2b24e6] via-[#0a1d17e6] to-[#05110ee6] p-7 text-emerald-100 shadow-[0_25px_60px_-25px_rgba(7,63,45,0.6)] ring-1 ring-emerald-500/20 backdrop-blur-xl lg:block">
    <div className="mb-10 rounded-2xl border border-emerald-100/30 bg-white/5 p-5 shadow-inner shadow-emerald-900/40">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">Ciyatake</p>
      <h2 className="mt-3 text-2xl font-semibold text-white">Admin Console</h2>
      <p className="mt-2 text-xs text-emerald-100/80">Quick access to every part of your commerce stack.</p>
    </div>
    <nav className="space-y-5">
      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200/80">
        Menu
      </div>
      <ul className="space-y-3">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          return (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white/15 text-white shadow-2xl shadow-emerald-900/40 ring-1 ring-emerald-200/60"
                      : "text-emerald-100/80 hover:bg-white/5 hover:text-white hover:ring-1 hover:ring-emerald-200/40"
                  }`
                }
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-lg shadow-inner shadow-emerald-900/40">
                  <Icon />
                </span>
                <span>{link.label}</span>
                <span className="ml-auto text-xs font-medium uppercase tracking-[0.25em] text-emerald-200/60 transition group-hover:text-white/80">
                  {"→"}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  </aside>
);

export default AdminSidebar;
