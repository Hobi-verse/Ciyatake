import { useCallback, useEffect, useMemo, useState } from "react";
import UserNavbar from "../../components/user/common/UserNavbar.jsx";
import AdvancedFilters, {
  SORT_OPTIONS,
} from "../../components/common/AdvancedFilters.jsx";
import ProductGrid from "../../components/common/ProductGrid.jsx";
import MobileBottomNav from "../../components/common/MobileBottomNav.jsx";
import Loader from "../../components/common/Loader.jsx";
import Skeleton from "../../components/common/Skeleton.jsx";
import { fetchProducts } from "../../api/catalog.js";
import { fetchCategories } from "../../api/categories.js";

const toTitleCase = (value = "") =>
  value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const DEFAULT_CATEGORY_OPTIONS = [
  { label: "All Products", value: "all" },
  { label: "Sarees", value: "sarees" },
  { label: "Kurtis", value: "kurtis" },
  { label: "Kurta Sets", value: "kurta-sets" },
  { label: "Dupatta Sets", value: "dupatta-sets" },
  { label: "Suits & Dress Material", value: "suits-dress-material" },
  { label: "Lehengas", value: "lehengas" },
  { label: "Other Ethnic", value: "other-ethnic" },
];

const HERO_HIGHLIGHTS = [
  {
    id: "delivery",
    badge: "FD",
    title: "Fast Delivery",
    description: "Delivery in 2-3 days",
  },
  {
    id: "location",
    badge: "IN",
    title: "Location",
    description: "Pan India delivery",
  },
  {
    id: "offer",
    badge: "OF",
    title: "Special Offer",
    description: "Free shipping on orders above Rs 999",
  },
];

const DEFAULT_FILTERS = {
  category: "all",
  subcategory: "all",
  gender: "all",
  colors: [],
  sizes: [],
  priceRanges: [],
  minRating: null,
};

const HomePage = ({ isLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryOptions, setCategoryOptions] = useState(
    DEFAULT_CATEGORY_OPTIONS
  );
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [productsLimit, setProductsLimit] = useState(48);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortOption, setSortOption] = useState("relevance");
  const [hasApiCategories, setHasApiCategories] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Prevent background scroll when mobile filter modal is open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showMobileFilters]);
  const [mobileFilterTab, setMobileFilterTab] = useState("Category");
  const [mobileFilterDraft, setMobileFilterDraft] = useState(filters);
  const [mobileFilterSearch, setMobileFilterSearch] = useState("");

  const loadCategories = useCallback(async ({ signal } = {}) => {
    setCategoryLoading(true);
    setCategoryError(null);

    try {
      const { categories } = await fetchCategories({}, { signal });

      if (signal?.aborted) {
        return;
      }

      const apiOptions = (Array.isArray(categories) ? categories : [])
        .map((category) => {
          const value =
            category.slug ?? category.id ?? category.name ?? category.raw?.slug;

          if (!value) {
            return null;
          }

          const rawValue = value.toString().trim();
          const normalizedValue = rawValue
            .toLowerCase()
            .replace(/[\s&]+/g, "-")
            .replace(/-+/g, "-");

          return {
            value: normalizedValue,
            label: category.name ?? toTitleCase(rawValue),
          };
        })
        .filter(Boolean);

      if (!apiOptions.length) {
        setHasApiCategories(false);
        return;
      }

      setCategoryOptions(() => {
        const map = new Map();

        DEFAULT_CATEGORY_OPTIONS.forEach((option) => {
          map.set(option.value, option);
        });

        apiOptions.forEach((option) => {
          if (option.value === "all") {
            map.set("all", {
              value: "all",
              label: option.label ?? "All Products",
            });
            return;
          }

          if (!map.has(option.value)) {
            map.set(option.value, option);
            return;
          }

          const existing = map.get(option.value);
          map.set(option.value, {
            ...existing,
            label: option.label ?? existing.label,
          });
        });

        return Array.from(map.values());
      });

      setHasApiCategories(true);
      setFilters((previous) => ({
        ...previous,
        category: apiOptions.some(
          (option) => option.value === previous.category
        )
          ? previous.category
          : "all",
      }));
    } catch (apiError) {
      if (signal?.aborted) {
        return;
      }

      setCategoryError(apiError);
      setHasApiCategories(false);
    } finally {
      if (!signal?.aborted) {
        setCategoryLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadCategories({ signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, [loadCategories]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 240);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const loadProducts = useCallback(
    async ({ signal } = {}) => {
      setLoading(true);
      setError(null);

      try {
        const query = { limit: productsLimit };

        // Apply filters to query
        if (filters.category && filters.category !== "all") {
          query.category = filters.category;
        }
        if (filters.subcategory && filters.subcategory !== "all") {
          query.category = filters.subcategory; // Use subcategory as the actual category filter
        }
        if (filters.gender && filters.gender !== "all") {
          query.targetGender = filters.gender;
        }
        if (filters.colors && filters.colors.length > 0) {
          query.colors = filters.colors.join(",");
        }
        if (filters.sizes && filters.sizes.length > 0) {
          query.sizes = filters.sizes.join(",");
        }
        if (filters.minRating) {
          query.minRating = filters.minRating;
        }
        if (filters.priceRanges && filters.priceRanges.length > 0) {
          const minPrice = Math.min(...filters.priceRanges.map((r) => r.min));
          const maxPrice = Math.max(...filters.priceRanges.map((r) => r.max));
          query.minPrice = minPrice;
          query.maxPrice = maxPrice;
        }
        if (sortOption && sortOption !== "relevance") {
          query.sort = sortOption;
        }

        const { items, total } = await fetchProducts(query, { signal });

        if (signal?.aborted) {
          return;
        }

        const nextProducts = Array.isArray(items) ? items : [];
        setProducts(nextProducts);
        const totalNumber = Number(total);
        setTotalProducts(
          Number.isFinite(totalNumber) ? totalNumber : nextProducts.length
        );

        if (!hasApiCategories && nextProducts.length) {
          const derivedMap = new Map();

          nextProducts.forEach((product) => {
            const value = product.category;
            if (!value) {
              return;
            }

            const normalizedValue = value
              .toString()
              .trim()
              .toLowerCase()
              .replace(/[\s&]+/g, "-")
              .replace(/-+/g, "-");

            if (!derivedMap.has(normalizedValue)) {
              derivedMap.set(normalizedValue, {
                value: normalizedValue,
                label: toTitleCase(normalizedValue),
              });
            }
          });

          if (derivedMap.size) {
            setCategoryOptions((current) => {
              const map = new Map();

              DEFAULT_CATEGORY_OPTIONS.forEach((option) => {
                map.set(option.value, option);
              });

              current.forEach((option) => {
                if (option?.value && !map.has(option.value)) {
                  map.set(option.value, option);
                }
              });

              derivedMap.forEach((option, key) => {
                if (!map.has(key)) {
                  map.set(key, option);
                }
              });

              return Array.from(map.values());
            });
          }
        }
      } catch (apiError) {
        if (signal?.aborted) {
          return;
        }

        setError(apiError);
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [hasApiCategories, filters, sortOption, productsLimit]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadProducts({ signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matches = products.filter((product) => {
      if (!normalizedSearch) {
        return true;
      }

      const haystack = [product.title, product.brand, product.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });

    // Products are already filtered by the API based on filters
    // Just apply search term filtering here
    return matches;
  }, [products, searchTerm]);

  const handleRetryCategories = () => {
    if (!categoryLoading) {
      loadCategories();
    }
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchTerm("");
    setProductsLimit(48);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleLoadMoreItems = () => {
    setProductsLimit((previous) => previous + 24);
  };

  const handleScrollToTop = () => {
    if (typeof window === "undefined") {
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (value) => {
    setSearchTerm((value ?? "").toString());
  };

  const displayedCount = filteredProducts.length;
  const totalCount = totalProducts || displayedCount;
  const hasProducts = products.length > 0;
  const isInitialProductLoad = loading && !hasProducts;
  const isRefreshingProducts = loading && hasProducts;

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "category") return value !== "all";
    if (key === "subcategory") return value !== "all";
    if (key === "gender") return value !== "all";
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== "";
  });

  const isDefaultView = !hasActiveFilters && searchTerm.trim() === "";

  return (
    <div className="min-h-screen bg-white pb-16 text-slate-900 sm:pb-0">
      <UserNavbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
        isLoggedIn={isLoggedIn}
      />

      {/* <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(event) => onSearchChange?.(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
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
          </div> */}

      <main className="mx-auto max-w-7xl px-2 py-4 sm:px-6 sm:py-10 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 text-center sm:mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-[#b8985b] sm:text-4xl">
            Products For You
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:mt-3 sm:text-base">
            Discover our complete collection with advanced filters
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
          {/* Filters Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              productCount={totalCount}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-4 rounded-lg border border-[#DCECE9] bg-[#F2EAE0] p-3 shadow-sm sm:space-y-6 sm:rounded-2xl sm:p-6 sm:shadow-[0_20px_45px_rgba(0,0,0,0.08)]">
            {/* Mobile Filter and Sort Bar */}
            <div className="flex items-center justify-between gap-3 lg:hidden">
              <div className="flex flex-1 gap-2">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 sm:text-sm"
                  onClick={() => {
                    setMobileFilterDraft(filters);
                    setShowMobileFilters(true);
                    setMobileFilterTab("Category");
                    setMobileFilterSearch("");
                  }}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                  Filters
                </button>
                <select
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 sm:text-sm"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/*  Mobile Filters Modal */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-[999] flex h-full w-full items-stretch bg-black/40 lg:hidden">
                <div
                  className="absolute left-0 right-0 mx-auto w-full"
                  style={{ top: "20vh", height: "80vh" }}
                >
                  <div className="relative flex h-full w-full bg-white">
                    {/* Sidebar Tabs */}
                    <div className="flex flex-col w-28 bg-gray-50 border-r h-full">
                      {[
                        "Category",
                        "Gender",
                        "Color",
                        "Size",
                        "Price",
                        "Rating",
                      ].map((tab) => (
                        <button
                          key={tab}
                          className={`py-3 px-2 text-left text-xs sm:text-sm font-medium border-l-4 transition-colors ${
                            mobileFilterTab === tab
                              ? "border-[#b8985b] bg-white text-[#b8985b]"
                              : "border-transparent text-gray-700 hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            setMobileFilterTab(tab);
                            setMobileFilterSearch("");
                          }}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    {/* Filter Options Panel */}
                    <div className="flex-1 flex flex-col min-w-0 h-full">
                      {/* Header */}
                      <div className="flex items-center justify-between border-b px-4 py-3">
                        <span className="font-semibold text-base">Filters</span>
                        <button
                          onClick={() => setShowMobileFilters(false)}
                          className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                          &times;
                        </button>
                      </div>
                      {/* Search box for options */}
                      <div className="px-4 py-2 border-b">
                        <input
                          type="text"
                          placeholder="Search"
                          value={mobileFilterSearch}
                          onChange={(e) =>
                            setMobileFilterSearch(e.target.value)
                          }
                          className="w-full rounded border border-gray-200 px-3 py-2 text-xs sm:text-sm focus:border-[#b8985b] focus:ring-[#b8985b]"
                        />
                      </div>
                      {/* Options List */}
                      <div className="flex-1 overflow-y-auto px-4 py-2">
                        {/* Render options for the selected tab */}
                        {mobileFilterTab === "Category" && (
                          <>
                            {/* Category options */}
                            {categoryOptions
                              .filter(
                                (opt) =>
                                  !mobileFilterSearch ||
                                  opt.label
                                    .toLowerCase()
                                    .includes(mobileFilterSearch.toLowerCase())
                              )
                              .map((opt) => (
                                <label
                                  key={opt.value}
                                  className="flex items-center py-2 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      mobileFilterDraft.category === opt.value
                                    }
                                    onChange={() =>
                                      setMobileFilterDraft((draft) => ({
                                        ...draft,
                                        category: opt.value,
                                      }))
                                    }
                                    className="mr-3 h-4 w-4 border-gray-300 text-[#b8985b] focus:ring-[#b8985b]"
                                  />
                                  <span className="text-sm">{opt.label}</span>
                                </label>
                              ))}
                          </>
                        )}
                        {mobileFilterTab === "Gender" && (
                          <>
                            {[
                              { value: "all", label: "All" },
                              { value: "Women", label: "Women" },
                              { value: "Men", label: "Men" },
                              { value: "Kids", label: "Kids" },
                              { value: "Unisex", label: "Unisex" },
                            ]
                              .filter(
                                (opt) =>
                                  !mobileFilterSearch ||
                                  opt.label
                                    .toLowerCase()
                                    .includes(mobileFilterSearch.toLowerCase())
                              )
                              .map((opt) => (
                                <label
                                  key={opt.value}
                                  className="flex items-center py-2 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      mobileFilterDraft.gender === opt.value
                                    }
                                    onChange={() =>
                                      setMobileFilterDraft((draft) => ({
                                        ...draft,
                                        gender: opt.value,
                                      }))
                                    }
                                    className="mr-3 h-4 w-4 border-gray-300 text-[#b8985b] focus:ring-[#b8985b]"
                                  />
                                  <span className="text-sm">{opt.label}</span>
                                </label>
                              ))}
                          </>
                        )}
                        {mobileFilterTab === "Color" && (
                          <>
                            {[
                              { name: "black" },
                              { name: "white" },
                              { name: "red" },
                              { name: "blue" },
                              { name: "green" },
                              { name: "pink" },
                              { name: "purple" },
                              { name: "yellow" },
                              { name: "orange" },
                              { name: "brown" },
                              { name: "grey" },
                              { name: "navy" },
                            ]
                              .filter(
                                (opt) =>
                                  !mobileFilterSearch ||
                                  opt.name
                                    .toLowerCase()
                                    .includes(mobileFilterSearch.toLowerCase())
                              )
                              .map((opt) => (
                                <label
                                  key={opt.name}
                                  className="flex items-center py-2 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={mobileFilterDraft.colors?.includes(
                                      opt.name
                                    )}
                                    onChange={() =>
                                      setMobileFilterDraft((draft) => ({
                                        ...draft,
                                        colors: draft.colors?.includes(opt.name)
                                          ? draft.colors.filter(
                                              (c) => c !== opt.name
                                            )
                                          : [...(draft.colors || []), opt.name],
                                      }))
                                    }
                                    className="mr-3 h-4 w-4 border-gray-300 text-[#b8985b] focus:ring-[#b8985b]"
                                  />
                                  <span className="text-sm capitalize">
                                    {opt.name}
                                  </span>
                                </label>
                              ))}
                          </>
                        )}
                        {mobileFilterTab === "Size" && (
                          <>
                            {["XS", "S", "M", "L", "XL", "XXL", "3XL"]
                              .filter(
                                (opt) =>
                                  !mobileFilterSearch ||
                                  opt
                                    .toLowerCase()
                                    .includes(mobileFilterSearch.toLowerCase())
                              )
                              .map((opt) => (
                                <label
                                  key={opt}
                                  className="flex items-center py-2 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={mobileFilterDraft.sizes?.includes(
                                      opt
                                    )}
                                    onChange={() =>
                                      setMobileFilterDraft((draft) => ({
                                        ...draft,
                                        sizes: draft.sizes?.includes(opt)
                                          ? draft.sizes.filter((s) => s !== opt)
                                          : [...(draft.sizes || []), opt],
                                      }))
                                    }
                                    className="mr-3 h-4 w-4 border-gray-300 text-[#b8985b] focus:ring-[#b8985b]"
                                  />
                                  <span className="text-sm">{opt}</span>
                                </label>
                              ))}
                          </>
                        )}
                        {mobileFilterTab === "Price" && (
                          <>
                            {[
                              { label: "Under ₹500", min: 0, max: 500 },
                              { label: "₹500 - ₹1000", min: 500, max: 1000 },
                              { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
                              { label: "₹2000 - ₹5000", min: 2000, max: 5000 },
                              {
                                label: "₹5000 - ₹10000",
                                min: 5000,
                                max: 10000,
                              },
                              {
                                label: "Above ₹10000",
                                min: 10000,
                                max: 999999,
                              },
                            ]
                              .filter(
                                (opt) =>
                                  !mobileFilterSearch ||
                                  opt.label
                                    .toLowerCase()
                                    .includes(mobileFilterSearch.toLowerCase())
                              )
                              .map((opt) => (
                                <label
                                  key={opt.label}
                                  className="flex items-center py-2 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={mobileFilterDraft.priceRanges?.some(
                                      (r) =>
                                        r.min === opt.min && r.max === opt.max
                                    )}
                                    onChange={() =>
                                      setMobileFilterDraft((draft) => ({
                                        ...draft,
                                        priceRanges: draft.priceRanges?.some(
                                          (r) =>
                                            r.min === opt.min &&
                                            r.max === opt.max
                                        )
                                          ? draft.priceRanges.filter(
                                              (r) =>
                                                !(
                                                  r.min === opt.min &&
                                                  r.max === opt.max
                                                )
                                            )
                                          : [...(draft.priceRanges || []), opt],
                                      }))
                                    }
                                    className="mr-3 h-4 w-4 border-gray-300 text-[#b8985b] focus:ring-[#b8985b]"
                                  />
                                  <span className="text-sm">{opt.label}</span>
                                </label>
                              ))}
                          </>
                        )}
                        {mobileFilterTab === "Rating" && (
                          <>
                            {[
                              { label: "4★ & above", value: 4 },
                              { label: "3★ & above", value: 3 },
                              { label: "2★ & above", value: 2 },
                              { label: "1★ & above", value: 1 },
                            ]
                              .filter(
                                (opt) =>
                                  !mobileFilterSearch ||
                                  opt.label
                                    .toLowerCase()
                                    .includes(mobileFilterSearch.toLowerCase())
                              )
                              .map((opt) => (
                                <label
                                  key={opt.value}
                                  className="flex items-center py-2 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      mobileFilterDraft.minRating === opt.value
                                    }
                                    onChange={() =>
                                      setMobileFilterDraft((draft) => ({
                                        ...draft,
                                        minRating: opt.value,
                                      }))
                                    }
                                    className="mr-3 h-4 w-4 border-gray-300 text-[#b8985b] focus:ring-[#b8985b]"
                                  />
                                  <span className="text-sm">{opt.label}</span>
                                </label>
                              ))}
                          </>
                        )}
                      </div>
                      {/* Sticky Footer Buttons */}
                      <div className="sticky bottom-0 left-0 right-0 bg-white border-t flex items-center justify-between gap-2 px-4 py-3">
                        <button
                          className="flex-1 rounded border border-[#b8985b] bg-white px-4 py-2 text-sm font-semibold text-[#b8985b]"
                          onClick={() => {
                            setMobileFilterDraft(filters);
                            setMobileFilterSearch("");
                          }}
                        >
                          Clear Filters
                        </button>
                        <button
                          className="flex-1 rounded bg-[#b8985b] px-4 py-2 text-sm font-semibold text-white"
                          onClick={() => {
                            setFilters(() => mobileFilterDraft);
                            setShowMobileFilters(false);
                          }}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Sort and Results Header */}
            <div className="hidden lg:flex lg:flex-col lg:gap-4 lg:sm:flex-row lg:sm:items-center lg:sm:justify-between">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                {isInitialProductLoad ? (
                  <Skeleton className="h-4 w-64" />
                ) : (
                  <p>
                    Showing {displayedCount} of {totalCount} products
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:gap-4">
                {!isDefaultView && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-sm font-semibold text-[#b8985b] transition-colors hover:text-[#a0824a]"
                  >
                    Clear all filters
                  </button>
                )}

                <div className="w-48">
                  <label className="sr-only" htmlFor="homepage-sort">
                    Sort products
                  </label>
                  <select
                    id="homepage-sort"
                    value={sortOption}
                    onChange={(event) => setSortOption(event.target.value)}
                    className="w-full rounded-lg border border-[#DCECE9] bg-white px-3 py-2 text-sm text-slate-700 focus:border-[#b8985b] focus:outline-none focus:ring-1 focus:ring-[#b8985b]"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        Sort by: {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Loading States */}
            {categoryLoading ? (
              <div className="flex flex-wrap items-center gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton
                    key={`homepage-category-skeleton-${index}`}
                    className="h-6 w-24"
                  />
                ))}
              </div>
            ) : null}

            {categoryError && (
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                <span className="font-medium">
                  Unable to load categories right now.
                </span>
                <button
                  type="button"
                  onClick={handleRetryCategories}
                  className="rounded border border-rose-400 px-3 py-1 font-semibold text-rose-100 transition-colors hover:bg-rose-500/20"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Products Grid */}
            {isInitialProductLoad ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={`homepage-product-skeleton-${index}`}
                    className="space-y-3 rounded-3xl border border-[#DCECE9] bg-white p-3 shadow-sm"
                  >
                    <Skeleton
                      className="h-44 w-full rounded-2xl"
                      rounded={false}
                    />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-12 text-center">
                <p className="text-rose-100">
                  We couldn&apos;t load products right now.
                </p>
                <button
                  type="button"
                  onClick={() => loadProducts()}
                  className="rounded-lg border border-rose-400 px-4 py-2 font-semibold text-rose-100 transition-colors hover:bg-rose-500/20"
                >
                  Retry loading products
                </button>
              </div>
            ) : filteredProducts.length ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#DCECE9] bg-white p-12 text-center">
                <p className="text-slate-600">
                  No products match your current filters.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="rounded-lg bg-[#b8985b] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#a0824a]"
                >
                  Clear filters
                </button>
              </div>
            )}

            {isRefreshingProducts ? (
              <div className="flex justify-center pt-6">
                <Loader label="Refreshing products" />
              </div>
            ) : null}

            {!loading &&
              !error &&
              filteredProducts.length > 0 &&
              filteredProducts.length < totalCount && (
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleLoadMoreItems}
                    className="inline-flex items-center justify-center rounded-lg bg-[#b8985b] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a0824a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8985b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2EAE0]"
                  >
                    More Items
                  </button>
                </div>
              )}
          </div>
        </div>
      </main>
      {showScrollTop && (
        <button
          type="button"
          onClick={handleScrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#b8985b]/60 bg-[#b8985b] text-white shadow-[0_10px_30px_rgba(185,152,91,0.35)] transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DCECE9]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M5 11l7-7 7 7" />
            <path d="M12 18V4" />
          </svg>
        </button>
      )}

      <MobileBottomNav />
    </div>
  );
};

export default HomePage;
