// this is just for refrence that how we have to use common components as much as
//  possible main common in single folder named common and then use it in other
// components we will delete the navbar later as we can use the tarnary operator
// for the navbar so we will chnage it later

import Navbar from "../../common/Navbar.jsx";
import logoutIcon from "../../../assets/icons/log-out.svg";
import { logoutUser } from "../../../api/auth";
import { clearAuthSession } from "../../../utils/authStorage";

const createIconRenderer =
  (src) =>
  ({ className = "" } = {}) =>
    <img src={src} alt="" className={className} aria-hidden="true" />;

const adminLinks = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Users", to: "/admin/users" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Reports", to: "/admin/reports" },
];

const AdminNavbar = () => {
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Admin logout request failed", error);
    } finally {
      clearAuthSession();
    }

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const adminActions = [
    {
      label: "Log out",
      icon: createIconRenderer(logoutIcon),
      onClick: handleLogout,
    },
  ];

  return (
    <Navbar
      brand="Ciyatake Admin"
      brandHref="/admin/dashboard"
      links={adminLinks}
      actions={adminActions}
    />
  );
};

export default AdminNavbar;
