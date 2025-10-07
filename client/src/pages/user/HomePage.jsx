import { useCallback, useEffect, useMemo, useState } from "react";
import UserNavbar from "../../components/user/common/UserNavbar.jsx";
import CategoryTabs from "../../components/common/CategoryTabs.jsx";
import SectionHeading from "../../components/common/SectionHeading.jsx";
import RangeSlider from "../../components/common/RangeSlider.jsx";
import SelectionGroup from "../../components/common/SelectionGroup.jsx";
import ColorSwatchGroup from "../../components/common/ColorSwatchGroup.jsx";
import ProductGrid from "../../components/common/ProductGrid.jsx";
import { fetchProducts } from "../../api/catalog.js";
import { fetchCategories, fetchCategoryFilters } from "../../api/categories.js";

const toTitleCase = (value = "") =>
  value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatSizeLabel = (value = "") => {
  if (!value) {
    return "";
  }

  return value.length <= 3 ? value.toUpperCase() : toTitleCase(value);
};

const buildSizeOptions = (sizes = []) => {
  const map = new Map();

  sizes.forEach((size) => {
    if (!size) {
      return;
    }

    let value;
    let label;

    if (typeof size === "string" || typeof size === "number") {
      const raw = size.toString();
      value = raw.toLowerCase();
      label = formatSizeLabel(raw);
    } else if (typeof size === "object") {
      const rawValue =
        size.value ?? size.slug ?? size.name ?? size.label ?? size.id;

      if (typeof rawValue !== "string" && typeof rawValue !== "number") {
        return;
      }

      const raw = rawValue.toString();
      value = raw.toLowerCase();
      const rawLabel =
        size.label ?? size.name ?? size.displayName ?? rawValue.toString();
      label = formatSizeLabel(rawLabel.toString());
    }

    if (!value) {
      return;
    }

    if (!map.has(value)) {
      map.set(value, {
        value,
        label: label ?? formatSizeLabel(value),
      });
    }
  });

  return [{ label: "All", value: "all" }, ...Array.from(map.values())];
};

const buildColorOptions = (colors = []) => {
  const swatches = new Map();

  colors.forEach((color) => {
    if (!color) {
      return;
    }

    if (typeof color === "string") {
      const value = color.toLowerCase();
      if (!swatches.has(value)) {
        swatches.set(value, {
          value,
          label: toTitleCase(color),
          hex: undefined,
        });
      }
      return;
    }

    const value =
      color.value?.toLowerCase?.() ??
      color.name?.toLowerCase?.() ??
      color.label?.toLowerCase?.();

    if (!value) {
      return;
    }

    if (!swatches.has(value)) {
      swatches.set(value, {
        value,
        label: color.label ?? toTitleCase(color.name ?? color.value ?? value),
        hex: color.hex ?? undefined,
      });
    }
  });

  return [
    { label: "All", value: "all", hex: "#d1fae5" },
    ...Array.from(swatches.values()),
  ];
};

const extractFilterValues = (filters = {}, keys = []) => {
  for (const key of keys) {
    const candidate = filters?.[key];

    if (Array.isArray(candidate) && candidate.length) {
      return candidate;
    }

    if (
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate)
    ) {
      if (Array.isArray(candidate.options) && candidate.options.length) {
        return candidate.options;
      }

      if (Array.isArray(candidate.values) && candidate.values.length) {
        return candidate.values;
      }
    }
  }

  return [];
};

const HomePage = ({ isLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([
    { label: "All", value: "all" },
  ]);
  const [hasApiCategories, setHasApiCategories] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  const [sizeOptions, setSizeOptions] = useState([
    { label: "All", value: "all" },
  ]);
  const [colorOptions, setColorOptions] = useState([
    { label: "All", value: "all", hex: "#d1fae5" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [derivedSizes, setDerivedSizes] = useState([]);
  const [derivedColors, setDerivedColors] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [filtersError, setFiltersError] = useState(null);
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

          return {
            value,
            label: category.name ?? toTitleCase(value),
          };
        })
        .filter(Boolean);

      if (apiOptions.length) {
        setCategoryOptions((current) => {
          const map = new Map();
          map.set("all", { label: "All", value: "all" });

          apiOptions.forEach((option) => {
            map.set(option.value, option);
          });

          current.forEach((option) => {
            if (option?.value && !map.has(option.value)) {
              map.set(option.value, option);
            }
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
      } else {
        setHasApiCategories(false);
      }
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

        const { items } = await fetchProducts(query, { signal });

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

        const nextDerivedCategories = Array.from(categorySet.values());

        if (!hasApiCategories && nextDerivedCategories.length) {
          setCategoryOptions([
            { label: "All", value: "all" },
            ...nextDerivedCategories,
          ]);
          setSelectedCategory((previous) =>
            previous === "all" || categorySet.has(previous) ? previous : "all"
          );
        } else if (hasApiCategories && nextDerivedCategories.length) {
          setCategoryOptions((current) => {
            const map = new Map();
            current.forEach((option) => {
              if (option?.value) {
                map.set(option.value, option);
              }
            });

            nextDerivedCategories.forEach((option) => {
              if (option?.value && !map.has(option.value)) {
                map.set(option.value, option);
              }
            });

            const allOption = map.get("all") ?? { label: "All", value: "all" };
            map.delete("all");
            return [allOption, ...Array.from(map.values())];
          });
        }

        const nextDerivedSizes = Array.from(sizeSet.values()).sort();
        setDerivedSizes(nextDerivedSizes);

        if (selectedCategory === "all" || filtersError) {
          const sizeOpts = buildSizeOptions(nextDerivedSizes);
          setSizeOptions(sizeOpts);
          setSelectedSize((previous) =>
            previous === "all" || sizeSet.has(previous) ? previous : "all"
          );
        }

        const nextDerivedColors = Array.from(colorMap.values());
        setDerivedColors(nextDerivedColors);

        if (selectedCategory === "all" || filtersError) {
          const colorOpts = buildColorOptions(nextDerivedColors);
          setColorOptions(colorOpts);
          setSelectedColor((previous) =>
            previous === "all" || colorMap.has(previous) ? previous : "all"
          );
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
    [filtersError, hasApiCategories, selectedCategory]
  );

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

  useEffect(() => {
    const derivedSizeOptions = buildSizeOptions(derivedSizes);
    const derivedColorOptions = buildColorOptions(derivedColors);

    if (selectedCategory === "all" || !hasApiCategories) {
      setFiltersLoading(false);
      setFiltersError(null);
      setSizeOptions(derivedSizeOptions);
      setSelectedSize((previous) =>
        previous === "all" ||
        derivedSizeOptions.some((option) => option.value === previous)
          ? previous
          : "all"
      );
      setColorOptions(derivedColorOptions);
      setSelectedColor((previous) =>
        previous === "all" ||
        derivedColorOptions.some((option) => option.value === previous)
          ? previous
          : "all"
      );
      return;
    }

    const controller = new AbortController();

    const loadCategoryFilters = async () => {
      setFiltersLoading(true);
      setFiltersError(null);

      try {
        const { filters } = await fetchCategoryFilters(selectedCategory, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        const sizeCandidates = extractFilterValues(filters, [
          "sizes",
          "size",
          "availableSizes",
          "sizeOptions",
          "options",
          "values",
        ]);

        const colorCandidates = extractFilterValues(filters, [
          "colors",
          "color",
          "colour",
          "availableColors",
          "colorOptions",
          "options",
          "values",
        ]);

        const nextSizeOptions = buildSizeOptions(
          sizeCandidates.length ? sizeCandidates : derivedSizes
        );
        setSizeOptions(nextSizeOptions);
        setSelectedSize((previous) =>
          previous === "all" ||
          nextSizeOptions.some((option) => option.value === previous)
            ? previous
            : "all"
        );

        const nextColorOptions = buildColorOptions(
          colorCandidates.length ? colorCandidates : derivedColors
        );
        setColorOptions(nextColorOptions);
        setSelectedColor((previous) =>
          previous === "all" ||
          nextColorOptions.some((option) => option.value === previous)
            ? previous
            : "all"
        );
      } catch (apiError) {
        if (controller.signal.aborted) {
          return;
        }

        setFiltersError(apiError);

        setSizeOptions(derivedSizeOptions);
        setSelectedSize((previous) =>
          previous === "all" ||
          derivedSizeOptions.some((option) => option.value === previous)
            ? previous
            : "all"
        );
        setColorOptions(derivedColorOptions);
        setSelectedColor((previous) =>
          previous === "all" ||
          derivedColorOptions.some((option) => option.value === previous)
            ? previous
            : "all"
        );
      } finally {
        if (!controller.signal.aborted) {
          setFiltersLoading(false);
        }
      }
    };

    loadCategoryFilters();

    return () => {
      controller.abort();
    };
  }, [selectedCategory, hasApiCategories, derivedSizes, derivedColors]);

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

  const handleRetryCategories = () => {
    if (!categoryLoading) {
      loadCategories();
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedSize("all");
    setSelectedColor("all");
    setPriceRange([minProductPrice, maxProductPrice]);
    setFiltersError(null);
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
          {categoryLoading ? (
            <p className="text-xs text-emerald-200/60">Loading categories…</p>
          ) : categoryError ? (
            <div className="flex flex-wrap items-center gap-3 text-xs text-rose-300/80">
              <span>
                Unable to load categories. Showing available products only.
              </span>
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
                {filtersLoading ? (
                  <p className="text-xs text-emerald-200/60">
                    Updating options…
                  </p>
                ) : filtersError ? (
                  <p className="text-xs text-rose-300/80">
                    Unable to load category-specific filters. Showing available
                    options.
                  </p>
                ) : null}
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
