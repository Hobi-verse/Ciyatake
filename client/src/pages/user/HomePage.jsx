import { useCallback, useEffect, useMemo, useState } from "react";
import UserNavbar from "../../components/user/common/UserNavbar.jsx";
import CategoryTabs from "../../components/common/CategoryTabs.jsx";
import SectionHeading from "../../components/common/SectionHeading.jsx";
import RangeSlider from "../../components/common/RangeSlider.jsx";
import SelectionGroup from "../../components/common/SelectionGroup.jsx";
import ColorSwatchGroup from "../../components/common/ColorSwatchGroup.jsx";
import ProductGrid from "../../components/common/ProductGrid.jsx";
import { fetchProducts } from "../../api/catalog.js";

const toTitleCase = (value = "") =>
  value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const HomePage = ({ isLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([
    { label: "All", value: "all" },
  ]);
  const [sizeOptions, setSizeOptions] = useState([
    { label: "All", value: "all" },
  ]);
  const [colorOptions, setColorOptions] = useState([
    { label: "All", value: "all", hex: "#d1fae5" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const priceValues = useMemo(
    () => products.map((product) => product.price ?? 0),
    [products]
  );
  const minProductPrice = useMemo(
    () => (priceValues.length ? Math.min(...priceValues) : 0),
    [priceValues]
  );
  const maxProductPrice = useMemo(
    () => (priceValues.length ? Math.max(...priceValues) : 0),
    [priceValues]
  );
  const priceStep = useMemo(() => {
    if (!priceValues.length) {
      return 100;
    }

    const span = maxProductPrice - minProductPrice;
    return Math.max(100, Math.round(span / 40) || 100);
  }, [maxProductPrice, minProductPrice, priceValues]);
  const [priceRange, setPriceRange] = useState([0, 0]);

  const loadProducts = useCallback(async ({ signal } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const { items } = await fetchProducts({ limit: 48 }, { signal });
      if (signal?.aborted) {
        return;
      }

      const nextProducts = Array.isArray(items) ? items : [];
      setProducts(nextProducts);

      const categorySet = new Map();
      const sizeSet = new Set();
      const colorMap = new Map();

      nextProducts.forEach((product) => {
        if (product.category) {
          const value = product.category;
          if (!categorySet.has(value)) {
            categorySet.set(value, {
              value,
              label: toTitleCase(value),
            });
          }
        }

        (product.sizes ?? []).forEach((size) => {
          if (size) {
            sizeSet.add(size.toLowerCase());
          }
        });

        (product.colors ?? []).forEach((colorOption) => {
          const value =
            typeof colorOption === "string"
              ? colorOption
              : colorOption.value ?? colorOption.name;
          if (!value) {
            return;
          }

          const label =
            typeof colorOption === "string"
              ? toTitleCase(colorOption)
              : colorOption.label ?? toTitleCase(value);
          const hex =
            typeof colorOption === "string"
              ? undefined
              : colorOption.hex ?? undefined;

          if (!colorMap.has(value)) {
            colorMap.set(value, {
              value,
              label,
              hex,
            });
          }
        });
      });

      const derivedCategories = Array.from(categorySet.values());
      setCategoryOptions([
        { label: "All", value: "all" },
        ...derivedCategories,
      ]);
      setSelectedCategory((previous) =>
        previous === "all" || categorySet.has(previous) ? previous : "all"
      );

      const derivedSizes = Array.from(sizeSet.values()).sort();
      setSizeOptions([
        { label: "All", value: "all" },
        ...derivedSizes.map((value) => ({
          value,
          label: value.toUpperCase(),
        })),
      ]);
      setSelectedSize((previous) =>
        previous === "all" || sizeSet.has(previous) ? previous : "all"
      );

      const derivedColors = Array.from(colorMap.values());
      setColorOptions([
        { label: "All", value: "all", hex: "#d1fae5" },
        ...derivedColors,
      ]);
      setSelectedColor((previous) =>
        previous === "all" || colorMap.has(previous) ? previous : "all"
      );
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
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadProducts({ signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, [loadProducts]);

  useEffect(() => {
    if (!priceValues.length) {
      setPriceRange([0, 0]);
      return;
    }

    setPriceRange([minProductPrice, maxProductPrice]);
  }, [minProductPrice, maxProductPrice, priceValues]);

  const filteredProducts = useMemo(() => {
    const [minPrice, maxPrice] = priceRange;
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      if (
        selectedCategory !== "all" &&
        (product.category ?? "") !== selectedCategory
      ) {
        return false;
      }

      if (selectedSize !== "all") {
        const availableSizes = product.sizes ?? [];
        if (
          !availableSizes.includes(selectedSize) &&
          !availableSizes.includes("all")
        ) {
          return false;
        }
      }

      if (selectedColor !== "all") {
        const availableColors = (product.colors ?? []).map((colorOption) =>
          typeof colorOption === "string"
            ? colorOption
            : colorOption.value ?? colorOption.name
        );
        if (!availableColors.includes(selectedColor)) {
          return false;
        }
      }

      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }

      if (normalizedSearch.length) {
        const matchesTitle = product.title
          ?.toLowerCase()
          .includes(normalizedSearch);
        return matchesTitle;
      }

      return true;
    });
  }, [
    priceRange,
    searchTerm,
    selectedCategory,
    selectedSize,
    selectedColor,
    products,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedSize("all");
    setSelectedColor("all");
    setPriceRange([minProductPrice, maxProductPrice]);
  };

  return (
    <div className="min-h-screen bg-[#0f231d] text-emerald-50">
      <UserNavbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={setSearchTerm}
        isLoggedIn={isLoggedIn}
      />

      <main className="mx-auto max-w-6xl space-y-12 px-4 py-12">
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/70">
            Categories
          </p>
          <CategoryTabs
            items={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-emerald-900/20 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-emerald-50">Filters</h3>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-sm font-medium text-emerald-200/80 underline-offset-4 transition hover:text-emerald-100 hover:underline"
            >
              Reset filters
            </button>
          </div>

          <div className="mt-6 space-y-8">
            <RangeSlider
              min={minProductPrice}
              max={maxProductPrice}
              step={priceStep}
              value={priceRange}
              onChange={setPriceRange}
            />

            <div className="grid gap-6 lg:grid-cols-[2fr_2fr_1fr]">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/70">
                  Size
                </p>
                <SelectionGroup
                  items={sizeOptions}
                  value={selectedSize}
                  onChange={setSelectedSize}
                />
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/70">
                  Color
                </p>
                <ColorSwatchGroup
                  colors={colorOptions}
                  value={selectedColor}
                  onChange={(nextValue) => setSelectedColor(nextValue)}
                />
              </div>

              <div className="flex items-end justify-end">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-emerald-200/80">
                  Showing {filteredProducts.length} products
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionHeading title="Featured Products" eyebrow="Explore" />
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
              <p>No products match your filters yet.</p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-full border border-emerald-300/60 px-4 py-2 font-medium text-emerald-100 transition hover:border-emerald-200 hover:bg-emerald-400/10"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;
