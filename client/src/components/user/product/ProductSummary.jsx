import { useEffect, useMemo, useState } from "react";
import RatingDisplay from "../../common/RatingDisplay.jsx";
import SelectionGroup from "../../common/SelectionGroup.jsx";
import ColorSwatchGroup from "../../common/ColorSwatchGroup.jsx";
import QuantitySelector from "../../common/QuantitySelector.jsx";
import { formatINR } from "../../../utils/currency.js";
import heartIcon from "../../../assets/icons/heart.svg";

const getVariantColorValue = (variantColor) => {
  if (!variantColor) {
    return null;
  }

  if (typeof variantColor === "string") {
    return variantColor;
  }

  return variantColor.value ?? variantColor.name ?? null;
};

const ProductSummary = ({
  product,
  onAddToCart,
  onBuyNow,
  actionStatus,
  onToggleWishlist,
  wishlistState,
  onRequestReview,
  reviewEligibility,
}) => {
  const variants = useMemo(
    () => (Array.isArray(product?.variants) ? product.variants : []),
    [product?.variants]
  );

  const defaultSize = useMemo(() => {
    if (product.defaultSize) {
      return product.defaultSize;
    }

    if (variants.length) {
      return variants[0]?.size ?? null;
    }

    return product.sizes?.[0] ?? null;
  }, [product.defaultSize, product.sizes, variants]);

  const defaultColor = useMemo(() => {
    if (product.defaultColor) {
      return product.defaultColor;
    }

    if (variants.length) {
      const variantColor = getVariantColorValue(variants[0]?.color);
      if (variantColor) {
        return variantColor;
      }
    }

    const firstColor = product.colors?.[0];
    if (!firstColor) {
      return null;
    }

    return typeof firstColor === "string"
      ? firstColor
      : firstColor.value ?? firstColor.name ?? null;
  }, [product.colors, product.defaultColor, variants]);

  const [size, setSize] = useState(defaultSize);
  const [color, setColor] = useState(defaultColor);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSize(defaultSize);
    setColor(defaultColor);
    setQuantity(1);
  }, [defaultColor, defaultSize, product?.id]);

  const sizeOptions = useMemo(
    () =>
      (product.sizes ?? []).map((value) => ({
        label: value.toUpperCase(),
        value,
      })),
    [product.sizes]
  );

  const colorOptions = useMemo(() => {
    const options = new Map();

    variants.forEach((variant) => {
      const value = getVariantColorValue(variant.color);
      if (!value || options.has(value)) {
        return;
      }

      options.set(value, {
        value,
        label:
          variant.color?.label ??
          variant.color?.name ??
          value
            .split(/[\s-_]+/)
            .filter(Boolean)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" "),
        hex: variant.color?.hex ?? undefined,
      });
    });

    if (!options.size && Array.isArray(product.colors)) {
      product.colors.forEach((colorOption) => {
        const value =
          typeof colorOption === "string"
            ? colorOption
            : colorOption.value ?? colorOption.name;
        if (!value || options.has(value)) {
          return;
        }

        options.set(value, {
          value,
          label:
            typeof colorOption === "string"
              ? colorOption
                  .split(/[\s-_]+/)
                  .filter(Boolean)
                  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                  .join(" ")
              : colorOption.label ?? colorOption.name ?? value,
          hex:
            typeof colorOption === "string"
              ? undefined
              : colorOption.hex ?? undefined,
        });
      });
    }

    return Array.from(options.values());
  }, [product.colors, variants]);

  const selectedVariant = useMemo(() => {
    if (!variants.length) {
      return null;
    }

    const directMatch = variants.find((variant) => {
      const colorValue = getVariantColorValue(variant.color);
      return (
        (!size || variant.size === size) && (!color || colorValue === color)
      );
    });

    if (directMatch) {
      return directMatch;
    }

    const sizeMatch = variants.find((variant) => variant.size === size);
    if (sizeMatch) {
      return sizeMatch;
    }

    return variants[0];
  }, [variants, size, color]);

  const maxQuantity = useMemo(() => {
    const stockLevel = selectedVariant?.stockLevel;
    const limitFromVariant = Number.isFinite(stockLevel)
      ? Math.max(0, stockLevel)
      : undefined;
    const limitFromProduct = Number.isFinite(product?.maxQuantity)
      ? product.maxQuantity
      : undefined;

    const limits = [limitFromVariant, limitFromProduct]
      .filter((value) => Number.isFinite(value) && value > 0)
      .sort((a, b) => a - b);

    if (limits.length) {
      return Math.max(1, limits[0]);
    }

    return 6;
  }, [product?.maxQuantity, selectedVariant?.stockLevel]);

  useEffect(() => {
    if (!maxQuantity || quantity <= maxQuantity) {
      return;
    }
    setQuantity(maxQuantity);
  }, [maxQuantity, quantity]);

  const ratingValue = useMemo(
    () => Number(product.rating ?? product.averageRating ?? 0),
    [product.rating, product.averageRating]
  );

  const reviewCountValue = product.reviewCount ?? product.reviewsCount ?? 0;

  const summaryText = product.summary ?? "";

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
    onAddToCart?.({ product, size, color, quantity, variant: selectedVariant });
  };

  const handleBuyNow = () => {
    onBuyNow?.({ product, size, color, quantity, variant: selectedVariant });
  };

  const handleToggleWishlist = () => {
    if (!onToggleWishlist || wishlistState?.loading) {
      return;
    }

    onToggleWishlist({
      product,
      size,
      color,
      quantity,
      variant: selectedVariant,
    });
  };

  const isVariantAvailable = selectedVariant
    ? selectedVariant.isActive !== false &&
      (selectedVariant.stockLevel === undefined ||
        selectedVariant.stockLevel > 0)
    : true;

  const isProcessing = actionStatus?.status === "loading";
  const addButtonDisabled = !isVariantAvailable || isProcessing;

  const wishlistButtonDisabled =
    wishlistState?.loading || !onToggleWishlist || !product;
  const wishlistButtonLabel = wishlistState?.inWishlist
    ? "Saved"
    : "Save to wishlist";

  const displayedPrice = useMemo(() => {
    const candidates = [
      selectedVariant?.priceOverride,
      selectedVariant?.price,
      product?.salePrice,
      product?.price,
      product?.basePrice,
    ];

    const numeric = candidates.find((value) => Number.isFinite(Number(value)));
    return Number.isFinite(Number(numeric)) ? Number(numeric) : 0;
  }, [product?.basePrice, product?.price, product?.salePrice, selectedVariant]);

  const hasExistingReview = Boolean(reviewEligibility?.existingReview);
  const reviewButtonLabel = hasExistingReview
    ? "Edit your review"
    : "Write a review";

  return (
    <section className="space-y-6 rounded-3xl border border-[#DCECE9] bg-white p-6 shadow-[0_36px_72px_rgba(15,23,42,0.12)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {product.category}
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            {product.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <RatingDisplay rating={ratingValue} count={reviewCountValue} />
            {onRequestReview ? (
              <button
                type="button"
                onClick={() =>
                  onRequestReview(hasExistingReview ? "edit" : "create")
                }
                className="rounded-full border border-[#b8985b] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#b8985b] transition hover:bg-[#b8985b] hover:text-white"
              >
                {reviewButtonLabel}
              </button>
            ) : null}
          </div>
        </header>

        {onToggleWishlist ? (
          <button
            type="button"
            onClick={handleToggleWishlist}
            disabled={wishlistButtonDisabled}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition ${
              wishlistState?.inWishlist
                ? "border-[#b8985b] bg-[#b8985b]/15 text-[#b8985b]"
                : "border-slate-300 bg-white text-slate-500 hover:border-[#b8985b] hover:text-[#b8985b]"
            } disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400`}
          >
            <img
              src={heartIcon}
              alt=""
              aria-hidden
              className={`h-4 w-4 ${
                wishlistState?.inWishlist ? "opacity-100" : "opacity-60"
              }`}
            />
            {wishlistState?.loading ? "Saving…" : wishlistButtonLabel}
          </button>
        ) : null}
      </div>

      <div
        className="text-sm leading-relaxed text-slate-600"
        dangerouslySetInnerHTML={{ __html: summaryText }}
      />

      <div className="rounded-2xl border border-[#DCECE9] bg-[#F2EAE0] p-4 text-lg font-semibold text-[#b8985b]">
        <span className="text-sm uppercase tracking-[0.2em] text-slate-600">
          Price
        </span>
        <p className="text-3xl text-[#b8985b]">{formatINR(displayedPrice)}</p>
        {product.discount ? (
          <p className="text-sm text-slate-600">
            {product.discount}% off today
          </p>
        ) : null}
      </div>

      {sizeOptions.length ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            <span>Size</span>
            {product.sizeGuide ? (
              <button
                type="button"
                onClick={() => product.onOpenSizeGuide?.()}
                className="text-[#b8985b] transition hover:text-[#a9894f]"
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Quantity
        </p>
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          max={maxQuantity}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={addButtonDisabled}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-[#b8985b] bg-[#F2EAE0] px-4 py-3 text-sm font-semibold text-[#b8985b] transition hover:bg-[#b8985b] hover:text-white disabled:cursor-not-allowed disabled:border-[#DCECE9] disabled:bg-white disabled:text-slate-400"
        >
          {isProcessing && actionStatus?.context !== "buy"
            ? "Adding…"
            : "Add to bag"}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isProcessing}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-transparent bg-[#b8985b] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#b8985b]/25 transition hover:bg-[#a9894f] disabled:cursor-not-allowed disabled:bg-[#b8985b]/60 disabled:text-white/80"
        >
          {isProcessing && actionStatus?.context === "buy"
            ? "Processing…"
            : "Buy now"}
        </button>
      </div>

      {benefits.length ? (
        <ul className="space-y-3 rounded-2xl border border-[#DCECE9] bg-[#F2EAE0] p-4 text-sm text-slate-700">
          {benefits.map((benefit, index) => (
            <li key={`${benefit.title}-${index}`} className="flex gap-3">
              <span aria-hidden className="mt-1 text-[#b8985b]">
                •
              </span>
              <div>
                <p className="font-semibold text-slate-900">{benefit.title}</p>
                {benefit.description ? (
                  <p className="text-slate-600">{benefit.description}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {actionStatus?.message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            actionStatus.status === "error"
              ? "border-rose-200 bg-rose-50 text-rose-600"
              : "border-[#c3dedd] bg-[#c3dedd]/20 text-[#2f4a55]"
          }`}
        >
          {actionStatus.message}
        </div>
      ) : null}

      {wishlistState?.error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {wishlistState.error}
        </div>
      ) : null}
    </section>
  );
};

export default ProductSummary;
