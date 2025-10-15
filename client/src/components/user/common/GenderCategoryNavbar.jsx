import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchCategoryTree } from "../../../api/categories.js";
import { logoutUser } from "../../../api/auth";
import { clearAuthSession } from "../../../utils/authStorage";
import searchIcon from "../../../assets/icons/search.svg";
import heartIcon from "../../../assets/icons/heart.svg";
import bagIcon from "../../../assets/icons/bag.svg";
import userIcon from "../../../assets/icons/user.svg";
import loginIcon from "../../../assets/icons/log-in.svg";
import logoutIcon from "../../../assets/icons/log-out.svg";
import menuIcon from "../../../assets/icons/menu.svg";
import closeIcon from "../../../assets/icons/close.svg";

const createIconRenderer =
  (src) =>
  ({ className = "" } = {}) =>
    <img src={src} alt="" className={className} aria-hidden="true" />;

const CategoryDropdown = ({ gender, categories, isVisible, onClose }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  // Organize categories for display based on gender
  const organizeCategories = (categories, gender) => {
    if (!categories || categories.length === 0) {
      return [];
    }

    // For women, we expect "Women Ethnic" and "Women Western" as separate main categories
    if (gender === "Women") {
      return categories.map((mainCategory) => ({
        title: mainCategory.name,
        mainCategory: mainCategory,
        subcategories: mainCategory.children || [],
      }));
    }

    // For Men and Kids, show all their categories
    return categories.map((mainCategory) => ({
      title: mainCategory.name,
      mainCategory: mainCategory,
      subcategories: mainCategory.children || [],
    }));
  };

  const categoryGroups = organizeCategories(categories, gender);

  // Special handling for Women's comprehensive dropdown
  const renderWomenDropdown = () => {
    const ethnicCategory = categoryGroups.find(
      (cat) => cat.title === "Women Ethnic"
    );
    const westernCategory = categoryGroups.find(
      (cat) => cat.title === "Women Western"
    );

    if (!ethnicCategory && !westernCategory) {
      return renderStandardDropdown();
    }

    return (
      <div className="grid grid-cols-12 gap-6">
        {/* Women Ethnic Section */}
        {ethnicCategory && (
          <div className="col-span-8">
            <h3 className="mb-4 border-b border-[#DCECE9] pb-1 text-sm font-semibold uppercase tracking-[0.25em] text-[#b8985b]">
              {ethnicCategory.title}
            </h3>
            <div className="grid grid-cols-6 gap-4">
              {/* Sarees */}
              <div className="space-y-1">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  Sarees
                </h4>
                {ethnicCategory.subcategories
                  .filter((sub) => sub.name.toLowerCase().includes("saree"))
                  .slice(0, 8)
                  .map((subcategory) => (
                    <Link
                      key={subcategory.slug}
                      to={`/category/${subcategory.slug}`}
                      className="block py-0.5 text-xs text-slate-500 transition hover:text-[#b8985b]"
                      onClick={onClose}
                    >
                      {subcategory.name}
                    </Link>
                  ))}
              </div>

              {/* Kurtis */}
              <div className="space-y-1">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  Kurtis
                </h4>
                {ethnicCategory.subcategories
                  .filter((sub) => sub.name.toLowerCase().includes("kurti"))
                  .slice(0, 5)
                  .map((subcategory) => (
                    <Link
                      key={subcategory.slug}
                      to={`/category/${subcategory.slug}`}
                      className="block py-0.5 text-xs text-slate-500 transition hover:text-[#b8985b]"
                      onClick={onClose}
                    >
                      {subcategory.name}
                    </Link>
                  ))}
              </div>

              {/* Kurta Sets */}
              <div className="space-y-1">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  Kurta Sets
                </h4>
                {ethnicCategory.subcategories
                  .filter(
                    (sub) =>
                      sub.name.toLowerCase().includes("kurta") &&
                      sub.name.toLowerCase().includes("set")
                  )
                  .slice(0, 6)
                  .map((subcategory) => (
                    <Link
                      key={subcategory.slug}
                      to={`/category/${subcategory.slug}`}
                      className="block py-0.5 text-xs text-slate-500 transition hover:text-[#b8985b]"
                      onClick={onClose}
                    >
                      {subcategory.name}
                    </Link>
                  ))}
              </div>

              {/* Dupatta Sets */}
              <div className="space-y-1">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  Dupatta Sets
                </h4>
                {ethnicCategory.subcategories
                  .filter(
                    (sub) =>
                      sub.name.toLowerCase().includes("sets") &&
                      !sub.name.toLowerCase().includes("kurta")
                  )
                  .slice(0, 4)
                  .map((subcategory) => (
                    <Link
                      key={subcategory.slug}
                      to={`/category/${subcategory.slug}`}
                      className="block py-0.5 text-xs text-slate-500 transition hover:text-[#b8985b]"
                      onClick={onClose}
                    >
                      {subcategory.name}
                    </Link>
                  ))}
              </div>

              {/* Suits & Dress Material */}
              <div className="space-y-1">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  Suits & Dress Material
                </h4>
                {ethnicCategory.subcategories
                  .filter(
                    (sub) =>
                      sub.name.toLowerCase().includes("suits") ||
                      sub.name.toLowerCase().includes("dress material")
                  )
                  .slice(0, 6)
                  .map((subcategory) => (
                    <Link
                      key={subcategory.slug}
                      to={`/category/${subcategory.slug}`}
                      className="block py-0.5 text-xs text-slate-500 transition hover:text-[#b8985b]"
                      onClick={onClose}
                    >
                      {subcategory.name}
                    </Link>
                  ))}
              </div>

              {/* Lehengas & Other Ethnic */}
              <div className="space-y-1">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  Lehengas & Other Ethnic
                </h4>
                {ethnicCategory.subcategories
                  .filter(
                    (sub) =>
                      sub.name.toLowerCase().includes("lehenga") ||
                      sub.name.toLowerCase().includes("blouse") ||
                      sub.name.toLowerCase().includes("dupatta") ||
                      sub.name.toLowerCase().includes("gown") ||
                      sub.name.toLowerCase().includes("petticoat")
                  )
                  .slice(0, 8)
                  .map((subcategory) => (
                    <Link
                      key={subcategory.slug}
                      to={`/category/${subcategory.slug}`}
                      className="block py-0.5 text-xs text-slate-500 transition hover:text-[#b8985b]"
                      onClick={onClose}
                    >
                      {subcategory.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Women Western Section */}
        {westernCategory && (
          <div className="col-span-4">
            <h3 className="mb-4 border-b border-[#DCECE9] pb-1 text-sm font-semibold uppercase tracking-[0.25em] text-[#b8985b]">
              {westernCategory.title}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                {westernCategory.subcategories
                  .slice(0, 6)
                  .map((subcategory) => (
                    <Link
                      key={subcategory.slug}
                      to={`/category/${subcategory.slug}`}
                      className="block py-0.5 text-xs text-slate-500 transition hover:text-[#b8985b]"
                      onClick={onClose}
                    >
                      {subcategory.name}
                    </Link>
                  ))}
              </div>
              <div className="space-y-1">
                {westernCategory.subcategories.slice(6).map((subcategory) => (
                  <Link
                    key={subcategory.slug}
                    to={`/category/${subcategory.slug}`}
                    className="block py-0.5 text-xs text-slate-500 transition hover:text-[#b8985b]"
                    onClick={onClose}
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStandardDropdown = () => {
    return (
      <div
        className={`grid gap-6 ${
          gender === "Men"
            ? "grid-cols-4"
            : gender === "Kids"
            ? "grid-cols-3"
            : "grid-cols-4"
        }`}
      >
        {categoryGroups.map((group, groupIndex) => (
          <div
            key={group.mainCategory?.slug || groupIndex}
            className="space-y-2"
          >
            <h3 className="mb-2 border-b border-[#DCECE9] pb-1 text-sm font-semibold uppercase tracking-[0.25em] text-[#b8985b]">
              {group.title}
            </h3>

            <div className="space-y-1">
              <Link
                to={`/category/${group.mainCategory?.slug}?gender=${gender}`}
                className="block py-0.5 text-xs font-semibold text-slate-700 transition hover:text-[#b8985b]"
                onClick={onClose}
              >
                All {group.mainCategory?.name}
              </Link>

              {group.subcategories && group.subcategories.length > 0 && (
                <div className="ml-1 space-y-0.5">
                  {group.subcategories.slice(0, 10).map((subcategory) => (
                    <Link
                      key={subcategory.slug || subcategory.id}
                      to={`/category/${subcategory.slug}?gender=${gender}`}
                      className="block py-0.5 text-xs text-slate-500 transition hover:text-[#b8985b]"
                      onClick={onClose}
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 top-full z-50 mt-2 w-full rounded-3xl border border-[#DCECE9] bg-white shadow-[0_32px_72px_rgba(15,23,42,0.16)]"
      style={{
        width: "90%",
        minWidth: "1000px",
        maxWidth: "1400px",
        marginLeft: 0,
      }}
    >
      <div className="px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {gender === "Women"
              ? "Women's Fashion"
              : gender === "Men"
              ? "Men's Collection"
              : "Kids Collection"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 transition hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* Category Content */}
        {gender === "Women" ? renderWomenDropdown() : renderStandardDropdown()}

        <div className="mt-6 flex gap-4 border-t border-[#DCECE9] pt-4">
          <Link
            to={`/${gender.toLowerCase()}`}
            className="inline-block rounded-full border border-[#b8985b] px-6 py-2 text-center text-sm font-medium text-[#b8985b] transition hover:bg-[#b8985b] hover:text-white"
            onClick={onClose}
          >
            Shop All {gender}'s Items
          </Link>
          <Link
            to="/offers"
            className="inline-block rounded-full border border-[#b8985b] px-6 py-2 text-center text-sm font-medium text-[#b8985b] transition hover:bg-[#b8985b] hover:text-white"
            onClick={onClose}
          >
            Special Offers
          </Link>
        </div>
      </div>
    </div>
  );
};

const GenderCategoryNavbar = ({
  searchTerm = "",
  onSearchChange,
  onSearchSubmit,
  isLoggedIn = false,
  onLogout,
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [genderCategories, setGenderCategories] = useState({
    Women: [],
    Men: [],
    Kids: [],
  });
  const hoverTimeoutRef = useRef(null);

  const genderLinks = [
    { label: "Women", value: "Women", to: "/women" },
    { label: "Men", value: "Men", to: "/men" },
    { label: "Kids", value: "Kids", to: "/kids" },
  ];

  useEffect(() => {
    const loadCategoriesForAllGenders = async () => {
      try {
        console.log("Loading categories for all genders...");

        // Load categories for each gender
        const genderPromises = genderLinks.map(async (genderLink) => {
          try {
            const response = await fetchCategoryTree({
              gender: genderLink.value,
            });
            console.log(`${genderLink.value} categories response:`, response);
            return {
              gender: genderLink.value,
              categories: response.success ? response.categories : [],
            };
          } catch (apiError) {
            console.error(
              `Failed to load ${genderLink.value} categories:`,
              apiError
            );
            return {
              gender: genderLink.value,
              categories: [],
            };
          }
        });

        const results = await Promise.all(genderPromises);

        const newGenderCategories = {};
        results.forEach(({ gender, categories }) => {
          newGenderCategories[gender] = categories;
        });

        console.log("All gender categories loaded:", newGenderCategories);
        setGenderCategories(newGenderCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategoriesForAllGenders();
  }, []);

  const handleMouseEnter = (gender) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setActiveDropdown(gender);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  const handleDropdownMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleDropdownMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  const handleDropdownClose = () => {
    setActiveDropdown(null);
  };

  const performLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      try {
        await logoutUser();
      } catch (apiError) {
        console.error("Logout request failed", apiError);
      } finally {
        clearAuthSession();

        if (typeof window !== "undefined" && window.localStorage) {
          try {
            window.localStorage.removeItem("User1");
          } catch (storageError) {
            console.warn("Unable to clear legacy auth key", storageError);
          }
        }
      }

      if (typeof onLogout === "function") {
        try {
          const result = await onLogout();
          if (result === false) return;
        } catch (handlerError) {
          console.error("Logout handler threw an error", handlerError);
        }
      }

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  const commonActions = [
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
  ];

  const authActions = isLoggedIn
    ? [
        {
          label: "Account",
          to: "/account",
          icon: createIconRenderer(userIcon),
        },
        {
          label: "Log out",
          icon: createIconRenderer(logoutIcon),
          onClick: performLogout,
        },
      ]
    : [
        {
          label: "Log in",
          to: "/login",
          icon: createIconRenderer(loginIcon),
        },
      ];

  const actions = [...commonActions, ...authActions];

  return (
    <header className="sticky top-0 z-50 border-b border-[#DCECE9] bg-white/95 text-slate-900 backdrop-blur">
      <nav className="relative mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center gap-4">
          {/* Brand */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-[#b8985b] transition hover:text-[#a9894f]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img
              src="/ciyatakeLogo.png"
              alt="Ciyatake"
              className="h-8 w-auto md:h-10"
            />
            <span className="text-base font-semibold tracking-tight md:text-lg">
              Ciyatake
            </span>
          </Link>

          {/* Desktop Navigation with Hover Dropdowns */}
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
            {genderLinks.map((link) => (
              <div
                key={link.value}
                onMouseEnter={() => handleMouseEnter(link.value)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={link.to}
                  className="px-2 py-2 transition hover:text-[#b8985b]"
                >
                  {link.label}
                </Link>
              </div>
            ))}

            <Link
              to="/accessories"
              className="px-2 py-2 transition hover:text-[#b8985b]"
            >
              Accessories
            </Link>

            <Link
              to="/home-living"
              className="px-2 py-2 transition hover:text-[#b8985b]"
            >
              Home & Living
            </Link>
          </div>

          {/* Full-width Dropdown positioned relative to navbar */}
          <div
            className="absolute top-full left-0 w-full"
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            {genderLinks.map((link) => (
              <CategoryDropdown
                key={`dropdown-${link.value}`}
                gender={link.value}
                categories={genderCategories[link.value] || []}
                isVisible={activeDropdown === link.value}
                onClose={handleDropdownClose}
              />
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="ml-auto flex items-center gap-3">
            {/* Search Field */}
            <div className="hidden lg:block lg:w-72">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSearchSubmit?.(searchTerm);
                    }
                  }}
                  className="w-full rounded-full border border-[#DCECE9] bg-white px-4 py-2 pl-10 text-sm text-slate-700 placeholder:text-slate-400 transition focus:border-[#b8985b] focus:outline-none focus:ring-2 focus:ring-[#b8985b]/25"
                />
                <img
                  src={searchIcon}
                  alt=""
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden items-center gap-2 md:flex">
              {actions.map((action, index) => {
                const key =
                  action.key ?? `${action.label ?? "action"}-${index}`;

                if (action.variant === "button" && action.to) {
                  return (
                    <Link
                      key={key}
                      to={action.to}
                      onClick={action.onClick}
                      className="inline-flex items-center justify-center rounded-full border border-[#b8985b] px-4 py-2 text-sm font-semibold text-[#b8985b] transition hover:bg-[#F2EAE0]"
                    >
                      {action.label}
                    </Link>
                  );
                }

                if (action.to) {
                  return (
                    <Link
                      key={key}
                      to={action.to}
                      onClick={action.onClick}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DCECE9] bg-white text-slate-600 transition hover:border-[#b8985b] hover:bg-[#F2EAE0]"
                      title={action.label}
                    >
                      <action.icon className="h-5 w-5" />
                    </Link>
                  );
                }

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={action.onClick}
                    disabled={isLoggingOut}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DCECE9] bg-white text-slate-600 transition hover:border-[#b8985b] hover:bg-[#F2EAE0] disabled:cursor-not-allowed disabled:border-[#DCECE9] disabled:text-slate-400"
                    title={isLoggingOut ? "Logging out..." : action.label}
                  >
                    <action.icon className="h-5 w-5" />
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DCECE9] bg-white text-slate-600 transition hover:border-[#b8985b] hover:bg-[#F2EAE0] lg:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <img
                src={isMobileMenuOpen ? closeIcon : menuIcon}
                alt=""
                aria-hidden="true"
                className="h-5 w-5"
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isMobileMenuOpen ? "mt-6" : "hidden"
          } flex flex-col gap-4 lg:hidden`}
        >
          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearchSubmit?.(searchTerm);
                }
              }}
              className="w-full rounded-xl border border-[#DCECE9] bg-white px-4 py-3 pl-10 text-sm text-slate-700 placeholder:text-slate-400 transition focus:border-[#b8985b] focus:outline-none focus:ring-2 focus:ring-[#b8985b]/25"
            />
            <img
              src={searchIcon}
              alt=""
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
          </div>

          {/* Mobile Navigation Links */}
          <ul className="flex flex-col gap-3 text-sm font-medium text-slate-700">
            {genderLinks.map((link) => (
              <li key={link.value}>
                <Link
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-[#DCECE9] bg-white px-3 py-2 transition hover:border-[#b8985b]/60 hover:bg-[#F2EAE0]"
                >
                  {link.label}
                  <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/accessories"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl border border-[#DCECE9] bg-white px-3 py-2 transition hover:border-[#b8985b]/60 hover:bg-[#F2EAE0]"
              >
                Accessories
                <span aria-hidden>→</span>
              </Link>
            </li>
            <li>
              <Link
                to="/home-living"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl border border-[#DCECE9] bg-white px-3 py-2 transition hover:border-[#b8985b]/60 hover:bg-[#F2EAE0]"
              >
                Home & Living
                <span aria-hidden>→</span>
              </Link>
            </li>
          </ul>

          {/* Mobile Actions */}
          <div className="flex flex-wrap gap-3">
            {actions.map((action, index) => {
              const key =
                action.key ?? `${action.label ?? "action"}-mobile-${index}`;

              if (action.variant === "button") {
                return (
                  <Link
                    key={key}
                    to={action.to}
                    onClick={action.onClick}
                    className="flex-1 rounded-full border border-[#b8985b] px-4 py-2 text-center text-sm font-semibold text-[#b8985b] transition hover:bg-[#F2EAE0]"
                  >
                    {action.label}
                  </Link>
                );
              }

              if (action.to) {
                return (
                  <Link
                    key={key}
                    to={action.to}
                    onClick={action.onClick}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#DCECE9] bg-white text-slate-600 transition hover:border-[#b8985b] hover:bg-[#F2EAE0]"
                    title={action.label}
                  >
                    <action.icon className="h-6 w-6" />
                  </Link>
                );
              }

              return (
                <button
                  key={key}
                  type="button"
                  onClick={action.onClick}
                  disabled={isLoggingOut}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#DCECE9] bg-white text-slate-600 transition hover:border-[#b8985b] hover:bg-[#F2EAE0] disabled:cursor-not-allowed disabled:border-[#DCECE9] disabled:text-slate-400"
                  title={isLoggingOut ? "Logging out..." : action.label}
                >
                  <action.icon className="h-6 w-6" />
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default GenderCategoryNavbar;
