import { useMemo, useState } from "react";
import UserNavbar from "../../components/user/common/UserNavbar.jsx";
import CategoryTabs from "../../components/common/CategoryTabs.jsx";
import SectionHeading from "../../components/common/SectionHeading.jsx";
import RangeSlider from "../../components/common/RangeSlider.jsx";
import SelectionGroup from "../../components/common/SelectionGroup.jsx";
import ColorSwatchGroup from "../../components/common/ColorSwatchGroup.jsx";
import ProductGrid from "../../components/common/ProductGrid.jsx";
import products from "../../data/products.json";

const categoryOptions = [
  { label: "All", value: "all" },
  { label: "Clothing", value: "clothing" },
  { label: "Shoes", value: "shoes" },
  { label: "Accessories", value: "accessories" },
];

const sizeOptions = [
  { label: "All", value: "all" },
  { label: "XS", value: "xs" },
  { label: "S", value: "s" },
  { label: "M", value: "m" },
  { label: "L", value: "l" },
  { label: "XL", value: "xl" },
];

const colorOptions = [
  { label: "All", value: "all" },
  { label: "White", value: "white", hex: "#ffffff" },
  { label: "Black", value: "black", hex: "#050505" },
  { label: "Blue", value: "blue", hex: "#1d4ed8" },
  { label: "Green", value: "green", hex: "#10b981" },
  { label: "Red", value: "red", hex: "#ef4444" },
  { label: "Brown", value: "brown", hex: "#9a3412" },
  { label: "Beige", value: "beige", hex: "#f5f5dc" },
  { label: "Navy", value: "navy", hex: "#1e3a8a" },
];

const HomePage = ({ isLoggedIn }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const priceValues = products.map((product) => product.price);
  const minProductPrice = priceValues.length ? Math.min(...priceValues) : 0;
  const maxProductPrice = priceValues.length ? Math.max(...priceValues) : 0;
  const priceStep = priceValues.length
    ? Math.max(100, Math.round((maxProductPrice - minProductPrice) / 40) || 100)
    : 100;
  const [priceRange, setPriceRange] = useState([
    minProductPrice,
    maxProductPrice,
  ]);

  const filteredProducts = useMemo(() => {
    const [minPrice, maxPrice] = priceRange;
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
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
        const availableColors = product.colors ?? [];
        if (
          !availableColors.includes(selectedColor) &&
          !availableColors.includes("all")
        ) {
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
  }, [priceRange, searchTerm, selectedCategory, selectedSize, selectedColor]);

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
          {filteredProducts.length ? (
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
