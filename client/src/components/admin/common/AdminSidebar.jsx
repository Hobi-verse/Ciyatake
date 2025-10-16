import { NavLink } from "react-router-dom";
import adminLinks from "./adminLinks";

const AdminSidebar = () => (
  <aside className="sticky top-24 hidden h-[calc(100vh-7.5rem)] w-72 flex-shrink-0 overflow-hidden rounded-3xl bg-white/90 text-[#6d5a3c] shadow-[0_25px_60px_-25px_rgba(94,74,42,0.25)] ring-1 ring-[#e6dccb] backdrop-blur lg:block">
    <div className="custom-scrollbar flex h-full flex-col gap-10 overflow-y-auto px-7 py-7">
      <div className="rounded-2xl border border-[#e6dccb] bg-white p-5 shadow-inner shadow-[#b8985b]/10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b8985b]">
          Ciyatake
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900">
          Admin Console
        </h2>
        <p className="mt-2 text-xs text-[#8f7843]">
          Quick access to every part of your commerce stack.
        </p>
      </div>
      <nav className="space-y-5">
        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b8985b]">
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
                        ? "bg-[#b8985b] text-white shadow-2xl shadow-[#b8985b]/30 ring-1 ring-[#dec9a4]"
                        : "text-[#8f7843] hover:bg-[#f2eae0] hover:text-[#5c4a2c] hover:ring-1 hover:ring-[#dec9a4]"
                    }`
                  }
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f2eae0] text-lg text-[#8f7843] shadow-inner shadow-[#b8985b]/15">
                    <Icon />
                  </span>
                  <span>{link.label}</span>
                  <span className="ml-auto text-xs font-medium uppercase tracking-[0.25em] text-[#c9b084] transition group-hover:text-white/90">
                    {"→"}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  </aside>
);

export default AdminSidebar;
