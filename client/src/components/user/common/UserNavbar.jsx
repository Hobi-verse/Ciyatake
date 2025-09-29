// this is just for refrence that how we have to use common components as much as possible main common in single folder named common and then use it in other components we will delete the navbar later as we can use the tarnary operator for the navbar so we will chnage it later

import Navbar from "../../common/Navbar.jsx";

const userLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Cart", to: "/cart" },
  { label: "Support", to: "/support" },
];

const userAction = { label: "Account", to: "/account" };

const UserNavbar = () => (
  <Navbar
    brand="Ciyatake"
    brandHref="/"
    links={userLinks}
    action={userAction}
  />
);

export default UserNavbar;
