import { useCallback, useEffect, useMemo, useState } from "react";
import UserNavbar from "../../components/user/common/UserNavbar.jsx";
import CategoryTabs from "../../components/common/CategoryTabs.jsx";
import SearchField from "../../components/common/SearchField.jsx";
import ProductGrid from "../../components/common/ProductGrid.jsx";
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
  { label: "Women", value: "women" },
  { label: "Men", value: "men" },
  { label: "Kids", value: "kids" },
  { label: "Accessories", value: "accessories" },
  { label: "Home & Living", value: "home-living" },
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

const SORT_OPTIONS = [
  { value: "relevance", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "rating-asc", label: "Rating: Low to High" },
];

const HomePage = ({ isLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryOptions, setCategoryOptions] = useState(
    DEFAULT_CATEGORY_OPTIONS
  );
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortOption, setSortOption] = useState("relevance");
  const [hasApiCategories, setHasApiCategories] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(null);

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
      setSelectedCategory((previous) => {
        if (previous === "all") {
          return previous;
        }

        return apiOptions.some((option) => option.value === previous)
          ? previous
          : "all";
      });
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

  const loadProducts = useCallback(
    async ({ signal } = {}) => {
      setLoading(true);
      setError(null);

      try {
        const query = { limit: 48 };
        if (selectedCategory && selectedCategory !== "all") {
          query.category = selectedCategory;
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
    [hasApiCategories, selectedCategory]
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
      const categoryValue = product.category
        ? product.category.toString().toLowerCase()
        : "";

      if (selectedCategory !== "all" && categoryValue !== selectedCategory) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack = [product.title, product.brand, product.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });

    if (matches.length <= 1) {
      return matches;
    }

    const sorted = [...matches];

    sorted.sort((a, b) => {
      const priceA = Number(a.price ?? a.basePrice ?? 0);
      const priceB = Number(b.price ?? b.basePrice ?? 0);
      const ratingA = Number(a.averageRating ?? a.rating ?? 0);
      const ratingB = Number(b.averageRating ?? b.rating ?? 0);

      switch (sortOption) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "rating-desc":
          return ratingB - ratingA;
        case "rating-asc":
          return ratingA - ratingB;
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, searchTerm, selectedCategory, sortOption]);

  const handleRetryCategories = () => {
    if (!categoryLoading) {
      loadCategories();
    }
  };

  const handleResetView = () => {
    setSelectedCategory("all");
    setSearchTerm("");
  };

  const displayedCount = filteredProducts.length;
  const totalCount = totalProducts || displayedCount;
  const isDefaultView = selectedCategory === "all" && searchTerm.trim() === "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#04110c] via-[#071b14] to-[#0f231d] text-emerald-50">
      <UserNavbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={setSearchTerm}
        isLoggedIn={isLoggedIn}
      />

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-12">
        <section className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-emerald-900/30 backdrop-blur-sm">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200/70">
              All Products
            </p>
            <h1 className="text-3xl font-semibold text-emerald-50 md:text-4xl">
              All our beautiful collection
            </h1>
            <p className="text-sm text-emerald-200/70">
              Discover handpicked looks crafted to make everyday style feel
              special.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {HERO_HIGHLIGHTS.map((highlight) => (
              <div
                key={highlight.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                    {highlight.badge}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-emerald-50">
                      {highlight.title}
                    </p>
                    <p className="text-xs text-emerald-200/70">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CategoryTabs
              items={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
            <div className="w-full md:w-72">
              <label className="sr-only" htmlFor="homepage-sort">
                Sort products
              </label>
              <select
                id="homepage-sort"
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#0b1a14] px-4 py-3 text-sm font-medium text-emerald-100 outline-none transition hover:border-emerald-300/40 focus:border-emerald-300/60"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {categoryLoading ? (
            <p className="text-xs text-emerald-200/60">Loading categories…</p>
          ) : categoryError ? (
            <div className="flex flex-wrap items-center gap-3 text-xs text-rose-200/80">
              <span>Unable to load categories right now.</span>
              <button
                type="button"
                onClick={handleRetryCategories}
                className="rounded-full border border-rose-300/60 px-3 py-1 font-medium text-rose-100 transition hover:border-rose-200 hover:bg-rose-400/10"
              >
                Retry
              </button>
            </div>
          ) : null}
        </section>

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-200/70">
              Showing {displayedCount} of {totalCount} products
            </p>
            {isDefaultView ? null : (
              <button
                type="button"
                onClick={handleResetView}
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-emerald-100 transition hover:border-emerald-300/60 hover:bg-emerald-400/10"
              >
                Reset view
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex min-h-[16rem] items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-sm text-emerald-200/70">
              Loading products...
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-rose-300/40 bg-rose-500/10 p-12 text-center text-sm text-rose-100">
              <p>We couldn&apos;t load products right now.</p>
              <button
                type="button"
                onClick={() => loadProducts()}
                className="rounded-full border border-rose-300/60 px-4 py-2 font-medium text-rose-100 transition hover:border-rose-200 hover:bg-rose-400/10"
              >
                Retry loading products
              </button>
            </div>
          ) : filteredProducts.length ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-emerald-300/40 bg-white/5 p-12 text-center text-sm text-emerald-200/80">
              <p>No products match your current view yet.</p>
              <button
                type="button"
                onClick={handleResetView}
                className="rounded-full border border-emerald-300/60 px-4 py-2 font-medium text-emerald-100 transition hover:border-emerald-200 hover:bg-emerald-400/10"
              >
                Reset view
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;
