import { Link } from "react-router-dom";
import { formatINR } from "../../utils/currency.js";
import starIcon from "../../assets/icons/star.svg";

const ProductCard = ({
  id,
  title,
  price,
  mrp,
  brand,
  discountPercentage,
  averageRating,
  reviewCount,
  tag,
  badge,
  tags,
  imageUrl,
  imageAlt,
  to,
  onSelect,
}) => {
  const numericPrice =
    typeof price === "number" && Number.isFinite(price) ? price : null;
  const numericMrp =
    typeof mrp === "number" && Number.isFinite(mrp) && mrp > 0 ? mrp : null;

  const formattedPrice =
    numericPrice !== null ? formatINR(numericPrice) : price;
  const formattedMrp = numericMrp ? formatINR(numericMrp) : null;

  const parsedDiscount = Number.parseFloat(discountPercentage);
  const fallbackDiscount =
    numericMrp && numericPrice !== null && numericMrp > numericPrice
      ? ((numericMrp - numericPrice) / numericMrp) * 100
      : null;
  const discountCandidate =
    Number.isFinite(parsedDiscount) && parsedDiscount > 0
      ? parsedDiscount
      : fallbackDiscount;
  const roundedDiscount =
    Number.isFinite(discountCandidate) && discountCandidate > 0
      ? Math.min(99, Math.max(1, Math.round(discountCandidate)))
      : null;
  const hasDiscount = typeof roundedDiscount === "number";
  const showOriginalPrice =
    numericMrp !== null && numericPrice !== null && numericMrp > numericPrice;

  const numericRating =
    typeof averageRating === "number" &&
    Number.isFinite(averageRating) &&
    averageRating > 0
      ? averageRating
      : null;
  const ratingDisplay = numericRating ? numericRating.toFixed(1) : null;
  const reviewLabel =
    typeof reviewCount === "number" && reviewCount > 0
      ? `(${reviewCount})`
      : null;

  const merchandisingLabel = (() => {
    const primary = badge ?? tag;
    if (typeof primary === "string" && primary.trim()) {
      return primary.trim();
    }

    if (Array.isArray(tags)) {
      const firstTag = tags.find(
        (entry) => typeof entry === "string" && entry.trim()
      );
      if (firstTag) {
        return firstTag.trim();
      }
    }

    if (!numericRating) {
      return "New";
    }

    return null;
  })();

  const cardContent = (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
        {hasDiscount && (
          <span className="absolute left-2 top-2 z-10 rounded bg-green-600 px-2 py-1 text-xs font-medium text-white">
            {roundedDiscount}% OFF
          </span>
        )}
        {merchandisingLabel && (
          <span className="absolute right-2 top-2 z-10 rounded bg-purple-600 px-2 py-1 text-xs font-medium text-white">
            {merchandisingLabel}
          </span>
        )}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt ?? title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        )}
        <button className="absolute right-2 bottom-2 rounded-full bg-white p-1.5 shadow-sm hover:shadow-md transition-shadow">
          <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className="flex flex-1 flex-col justify-between p-2 sm:p-3">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-xs font-medium text-gray-900 sm:text-sm">
            {title}
          </h3>
          {brand && (
            <p className="text-xs text-gray-500">{brand}</p>
          )}
        </div>

        <div className="mt-2 space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-gray-900 sm:text-base">
              {formattedPrice}
            </span>
            {showOriginalPrice && (
              <span className="text-xs text-gray-500 line-through sm:text-sm">
                {formattedMrp}
              </span>
            )}
          </div>

          {numericRating ? (
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 rounded bg-green-600 px-1.5 py-0.5">
                <img src={starIcon} alt="" className="h-3 w-3 brightness-0 invert" />
                <span className="text-xs font-medium text-white">
                  {ratingDisplay}
                </span>
              </div>
              {reviewLabel && (
                <span className="text-xs text-gray-500">{reviewLabel}</span>
              )}
            </div>
          ) : (
            <div className="text-xs text-gray-600">New</div>
          )}

          <div className="text-xs text-green-600 font-medium">
            Free Delivery
          </div>
        </div>
      </div>
    </article>
  );

  if (to) {
    return (
      <Link to={to} onClick={() => onSelect?.(id)}>
        {cardContent}
      </Link>
    );
  }

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect?.(id)}
        className="h-full w-full text-left"
      >
        {cardContent}
      </button>
    );
  }

  return <div className="h-full w-full">{cardContent}</div>;
};

export default ProductCard;
