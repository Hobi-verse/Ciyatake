import { Link } from "react-router-dom";
import { formatINR } from "../../utils/currency.js";

const ProductCard = ({
  id,
  title,
  price,
  imageUrl,
  imageAlt,
  to,
  onSelect,
}) => {
  const formattedPrice = typeof price === "number" ? formatINR(price) : price;

  const cardContent = (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-4 shadow-lg transition hover:border-emerald-300/40 hover:bg-emerald-400/5">
      <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-emerald-900/40">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt ?? title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-emerald-200/80">{formattedPrice}</p>
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
