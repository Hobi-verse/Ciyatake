import { useEffect, useMemo, useState } from "react";
import RatingDisplay from "../../common/RatingDisplay.jsx";
import SelectionGroup from "../../common/SelectionGroup.jsx";
import ColorSwatchGroup from "../../common/ColorSwatchGroup.jsx";
import QuantitySelector from "../../common/QuantitySelector.jsx";
import { formatINR } from "../../../utils/currency.js";

const ProductSummary = ({ product, onAddToCart, onBuyNow }) => {
  const defaultSize = useMemo(
    () => product.defaultSize ?? product.sizes?.[0] ?? null,
    [product.defaultSize, product.sizes]
  );

  const defaultColor = useMemo(() => {
    if (product.defaultColor) {
      return product.defaultColor;
    }

    const firstColor = product.colors?.[0];
    if (!firstColor) {
      return null;
    }

    return typeof firstColor === "string"
      ? firstColor
      : firstColor.value ?? firstColor.name ?? null;
  }, [product.colors, product.defaultColor]);

  const [size, setSize] = useState(defaultSize);
  const [color, setColor] = useState(defaultColor);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSize(defaultSize);
    setColor(defaultColor);
    setQuantity(1);
  }, [defaultColor, defaultSize, product.id]);

  const sizeOptions = useMemo(
    () =>
      (product.sizes ?? []).map((value) => ({
        label: value.toUpperCase(),
        value,
      })),
    [product.sizes]
  );

  const colorOptions = useMemo(() => {
    if (!product.colors?.length) {
      return [];
    }

    return product.colors.map((colorOption) =>
      typeof colorOption === "string"
        ? { label: colorOption, value: colorOption, hex: colorOption }
        : colorOption
    );
  }, [product.colors]);

  const ratingValue = useMemo(
    () => Number(product.rating ?? product.averageRating ?? 0),
    [product.rating, product.averageRating]
  );

  const reviewCountValue = product.reviewCount ?? product.reviewsCount ?? 0;

  const summaryText = product.summary ?? product.description ?? "";

  const benefits = useMemo(() => {
    if (!Array.isArray(product.benefits)) {
      return [];
    }

    return product.benefits.map((benefit) =>
      typeof benefit === "string"
        ? { title: benefit, description: "" }
        : {
            title: benefit.title ?? "Benefit",
            description: benefit.description ?? benefit.detail ?? "",
          }
    );
  }, [product.benefits]);

  const handleAddToCart = () => {
    onAddToCart?.({ product, size, color, quantity });
  };

  const handleBuyNow = () => {
    onBuyNow?.({ product, size, color, quantity });
  };

  return (
    <section className="space-y-6 rounded-3xl border border-white/5 bg-white/5 p-6 shadow-xl">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200/70">
          {product.category}
        </p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">
          {product.title}
        </h1>
        <RatingDisplay rating={ratingValue} count={reviewCountValue} />
      </header>

      <p className="text-sm leading-relaxed text-emerald-100/80">
        {summaryText}
      </p>

      <div className="rounded-2xl bg-[#0d221c] p-4 text-lg font-semibold text-emerald-100">
        <span className="text-sm uppercase tracking-[0.2em] text-emerald-200/70">
          Price
        </span>
        <p className="text-3xl text-emerald-200">{formatINR(product.price)}</p>
        {product.discount ? (
          <p className="text-sm text-emerald-200/70">
            {product.discount}% off today
          </p>
        ) : null}
      </div>

      {sizeOptions.length ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/60">
            <span>Size</span>
            {product.sizeGuide ? (
              <button
                type="button"
                onClick={() => product.onOpenSizeGuide?.()}
                className="text-emerald-200 transition hover:text-emerald-100"
              >
                Size Guide
              </button>
            ) : null}
          </div>
          <SelectionGroup value={size} onChange={setSize} items={sizeOptions} />
        </div>
      ) : null}

      {colorOptions.length ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/60">
            Color
          </p>
          <ColorSwatchGroup
            value={color}
            onChange={setColor}
            colors={colorOptions}
          />
        </div>
      ) : null}

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/60">
          Quantity
        </p>
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          max={product.maxQuantity ?? 6}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-emerald-300/70 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-200 hover:bg-emerald-400/20"
        >
          Add to bag
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-transparent bg-emerald-400 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
        >
          Buy now
        </button>
      </div>

      {benefits.length ? (
        <ul className="space-y-3 rounded-2xl bg-[#0d221c] p-4 text-sm text-emerald-100/80">
          {benefits.map((benefit, index) => (
            <li key={`${benefit.title}-${index}`} className="flex gap-3">
              <span aria-hidden className="mt-1 text-emerald-300">
                •
              </span>
              <div>
                <p className="font-semibold text-emerald-100">
                  {benefit.title}
                </p>
                {benefit.description ? (
                  <p className="text-emerald-200/80">{benefit.description}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
};

export default ProductSummary;
