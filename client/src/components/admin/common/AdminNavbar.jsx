// this is just for refrence that how we have to use common components as much as possible main common in single folder named common and then use it in other components we will delete the navbar later as we can use the tarnary operator for the navbar so we will chnage it later

import Navbar from "../../common/Navbar.jsx";

const adminLinks = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Users", to: "/admin/users" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Reports", to: "/admin/reports" },
];

const adminActions = [
  { label: "Log out", to: "/admin/logout", variant: "button" },
];

const AdminNavbar = () => (
  <Navbar
    brand="Ciyatake Admin"
    brandHref="/admin/dashboard"
    links={adminLinks}
    actions={adminActions}
  />
);

export default AdminNavbar;
