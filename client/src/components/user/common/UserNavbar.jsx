// this is just for refrence that how we have to use common components as much as possible main common in single folder named common and then use it in other components we will delete the navbar later as we can use the tarnary operator for the navbar so we will chnage it later

import Navbar from "../../common/Navbar.jsx";
import searchIcon from "../../../assets/icons/search.svg";
import heartIcon from "../../../assets/icons/heart.svg";
import bagIcon from "../../../assets/icons/bag.svg";
import userIcon from "../../../assets/icons/user.svg";

const userLinks = [
  { label: "New Arrivals", to: "/new" },
  { label: "Men", to: "/men" },
  { label: "Women", to: "/women" },
  { label: "Accessories", to: "/accessories" },
  { label: "Sale", to: "/sale" },
];

const createIconRenderer =
  (src) =>
  ({ className = "" } = {}) =>
    <img src={src} alt="" className={className} aria-hidden="true" />;

const UserNavbar = ({
  searchTerm = "",
  onSearchChange,
  onSearchSubmit,
  isLoggedIn = false,
}) => {
  const actions = [
    {
      label: "Wishlist",
      to: "/wishlist",
      icon: createIconRenderer(heartIcon),
    },
    {
      label: "Cart",
      to: "/cart",
      icon: createIconRenderer(bagIcon),
    },

    isLoggedIn
      ? {
          label: "Account",
          to: "/account",
          icon: createIconRenderer(userIcon),
        }
      : {
          label: "Login",
          to: "/login",
          variant: "button",
        },
  ];

  return (
    <Navbar
      brand={
        <>
          <img
            src="/ciyatakeLogo.png"
            alt="Ciyatake"
            className="h-8 w-auto md:h-10"
          />
          <span className="text-base font-semibold tracking-tight text-emerald-50 md:text-lg">
            Ciyatake
          </span>
        </>
      }
      brandHref="/"
      links={userLinks}
      search={{
        placeholder: "Search products...",
        value: searchTerm,
        onChange: (value) => onSearchChange?.(value),
        onSubmit: (value) => onSearchSubmit?.(value),
        icon: createIconRenderer(searchIcon),
      }}
      actions={actions}
    />
  );
};

export default UserNavbar;
