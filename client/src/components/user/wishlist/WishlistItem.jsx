import { Link } from "react-router-dom";
import { formatINR } from "../../../utils/currency.js";
import bagIcon from "../../../assets/icons/bag.svg";
import trashIcon from "../../../assets/icons/trash.svg";

const WishlistBadge = ({ inStock }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
      inStock ? "bg-[#c3dedd] text-[#2f4a55]" : "bg-[#F6C7B3] text-[#8a4b3c]"
    }`}
  >
    <span
      className={`h-2 w-2 rounded-full ${
        inStock ? "bg-[#82B2C0]" : "bg-[#F6C7B3]"
      }`}
    />
    {inStock ? "In stock" : "Back soon"}
  </span>
);

const WishlistItem = ({ item, onAddToCart, onRemove }) => {
  if (!item) return null;

  const canAddToCart = Boolean(item.variantSku && item.inStock !== false);

  return (
    <article className="flex flex-col gap-5 rounded-3xl border border-[#DCECE9] bg-white p-5 shadow-[0_24px_48px_rgba(15,23,42,0.1)] md:flex-row md:items-center md:justify-between">
      <div className="flex gap-4">
        <Link
          to={`/products/${item.productId ?? item.id}`}
          className="block h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#DCECE9] bg-[#F2EAE0]"
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : null}
        </Link>
        <div className="space-y-2">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold text-slate-900">
              {item.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
              {item.size ? <span>Size {item.size}</span> : null}
              {item.color ? <span>{item.color}</span> : null}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-[#b8985b]">
              {formatINR(item.price)}
            </p>
            <WishlistBadge inStock={item.inStock !== false} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 text-sm font-medium text-slate-600 md:flex-row md:items-center">
        <button
          type="button"
          onClick={() => onAddToCart?.(item)}
          disabled={!canAddToCart}
          className="inline-flex items-center gap-2 rounded-full bg-[#b8985b] px-4 py-2 text-white transition hover:bg-[#a9894f] disabled:cursor-not-allowed disabled:bg-[#b8985b]/50 disabled:text-white/70"
        >
          <img src={bagIcon} alt="" aria-hidden className="h-4 w-4" />
          {canAddToCart ? "Add to cart" : "Select variant"}
        </button>
        <button
          type="button"
          onClick={() => onRemove?.(item)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-slate-500 transition hover:border-[#b8985b] hover:text-[#b8985b]"
        >
          <img src={trashIcon} alt="" aria-hidden className="h-4 w-4" />
          Remove
        </button>
      </div>
    </article>
  );
};

export default WishlistItem;
