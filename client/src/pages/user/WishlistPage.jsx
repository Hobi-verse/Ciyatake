import { useCallback, useEffect, useMemo, useState } from "react";
import UserNavbar from "../../components/user/common/UserNavbar.jsx";
import Breadcrumbs from "../../components/common/Breadcrumbs.jsx";
import WishlistItem from "../../components/user/wishlist/WishlistItem.jsx";
import ProductGrid from "../../components/common/ProductGrid.jsx";
import Loader from "../../components/common/Loader.jsx";
import Skeleton from "../../components/common/Skeleton.jsx";
import heartIcon from "../../assets/icons/heart.svg";
import {
  emptyWishlist,
  fetchWishlist,
  moveWishlistItemToCart,
  removeWishlistItem,
} from "../../api/wishlist.js";
import { fetchProducts } from "../../api/catalog.js";
import { ApiError } from "../../api/client.js";

const getErrorMessage = (error, fallbackMessage) => {
  if (!error) {
    return fallbackMessage;
  }

  if (error instanceof ApiError && error.payload) {
    const payloadMessage =
      error.payload?.message ??
      error.payload?.error ??
      (Array.isArray(error.payload?.errors)
        ? error.payload.errors[0]?.message
        : null);

    if (payloadMessage) {
      return payloadMessage;
    }
  }

  if (typeof error?.message === "string" && error.message.length) {
    return error.message;
  }

  return fallbackMessage;
};

const WishlistPage = ({ isLoggedIn = false }) => {
  const [wishlist, setWishlist] = useState(() => emptyWishlist());
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const loadWishlist = useCallback(async ({ signal } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const [wishlistResponse, productsResponse] = await Promise.all([
        fetchWishlist({ signal }),
        fetchProducts({}, { signal }),
      ]);

      if (signal?.aborted) {
        return;
      }

      const productItems = Array.isArray(productsResponse?.items)
        ? productsResponse.items
        : Array.isArray(productsResponse?.products)
        ? productsResponse.products
        : Array.isArray(productsResponse)
        ? productsResponse
        : [];

      setWishlist(wishlistResponse);
      setCatalogProducts(productItems);
      setActionError("");
    } catch (apiError) {
      if (!signal?.aborted) {
        setError(apiError);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadWishlist({ signal: controller.signal });

    return () => controller.abort();
  }, [loadWishlist]);

  const items = useMemo(() => wishlist.items ?? [], [wishlist.items]);

  const hasItems = items.length > 0;
  const isInitialWishlistLoad = loading && !hasItems;
  const isRefreshingWishlist = loading && hasItems;

  const handleRemove = useCallback(
    async (targetItem) => {
      const itemId =
        typeof targetItem === "string" ? targetItem : targetItem?.id ?? null;

      if (!itemId) {
        return;
      }

      setActionError("");

      try {
        const updatedWishlist = await removeWishlistItem(itemId);
        setWishlist(updatedWishlist);
        setToastMessage("Removed from wishlist");
        window.setTimeout(() => setToastMessage(""), 2500);
      } catch (apiError) {
        const message = getErrorMessage(
          apiError,
          "We couldn't remove that item just yet. Please retry."
        );
        setActionError(message);
        loadWishlist().catch(() => {});
      }
    },
    [loadWishlist]
  );

  const handleAddToCart = useCallback(
    async (targetItem) => {
      const item =
        typeof targetItem === "object"
          ? targetItem
          : items.find((entry) => entry.id === targetItem);

      if (!item?.id) {
        return;
      }

      if (!item.variantSku) {
        setActionError(
          "Please select a size and color for this item before adding it to your cart."
        );
        return;
      }

      setActionError("");

      try {
        const { wishlist: updatedWishlist } = await moveWishlistItemToCart(
          item.id,
          { quantity: 1 }
        );

        if (updatedWishlist) {
          setWishlist(updatedWishlist);
        } else {
          await loadWishlist();
        }

        setToastMessage("Moved to cart");
        window.setTimeout(() => setToastMessage(""), 2500);
      } catch (apiError) {
        if (apiError instanceof ApiError && apiError.status === 401) {
          setActionError("Please sign in to manage your wishlist.");
          return;
        }

        const message = getErrorMessage(
          apiError,
          "We couldn't move that item to your cart. Please try again."
        );
        setActionError(message);
        loadWishlist().catch(() => {});
      }
    },
    [items, loadWishlist]
  );

  const recommendedProducts = useMemo(() => {
    const wishlistIds = new Set(items.map((item) => item.productId));
    return catalogProducts
      .filter((product) => !wishlistIds.has(product.id))
      .slice(0, 4);
  }, [catalogProducts, items]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <UserNavbar isLoggedIn={isLoggedIn} />
      <main className="mx-auto max-w-6xl space-y-12 px-4 py-12">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Wishlist" }]}
        />

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold text-[#b8985b] md:text-4xl">
            Wishlist
          </h1>
          <p className="text-sm text-slate-600">
            Save items you love and move them to your cart whenever you’re
            ready.
          </p>
          {isInitialWishlistLoad ? (
            <Skeleton className="h-6 w-32 rounded-full" rounded={false} />
          ) : (
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DCECE9] bg-[#F2EAE0] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#b8985b]">
              <img src={heartIcon} alt="" className="h-4 w-4" aria-hidden />
              {wishlist.itemCount ?? items.length} saved
            </span>
          )}
        </header>

        <section className="space-y-4">
          {error ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center text-sm text-rose-700">
              We couldn&apos;t load your wishlist. Please try again.
              <button
                type="button"
                onClick={loadWishlist}
                className="mt-4 inline-flex items-center justify-center rounded-full border border-rose-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700 transition hover:border-rose-400 hover:bg-rose-100"
              >
                Retry
              </button>
            </div>
          ) : isInitialWishlistLoad ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`wishlist-item-skeleton-${index}`}
                className="rounded-3xl border border-[#DCECE9] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Skeleton
                    className="h-40 w-full rounded-2xl sm:w-40"
                    rounded={false}
                  />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex flex-wrap gap-2">
                      <Skeleton
                        className="h-9 w-28 rounded-full"
                        rounded={false}
                      />
                      <Skeleton
                        className="h-9 w-28 rounded-full"
                        rounded={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : hasItems ? (
            <>
              {items.map((item) => (
                <WishlistItem
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  onRemove={handleRemove}
                />
              ))}
              {isRefreshingWishlist ? (
                <div className="flex justify-center pt-4">
                  <Loader label="Refreshing wishlist" />
                </div>
              ) : null}
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#DCECE9] bg-[#DCECE9]/40 p-10 text-center text-sm text-slate-600">
              Your wishlist is empty. Browse products and tap the heart icon to
              save them here.
            </div>
          )}
        </section>

        {recommendedProducts.length ? (
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[#b8985b]">
                You might also like
              </h2>
              <p className="text-sm text-slate-600">
                Customers who saved these items also considered these picks.
              </p>
            </div>
            <ProductGrid products={recommendedProducts} />
          </section>
        ) : null}
      </main>

      {actionError ? (
        <div className="fixed inset-x-0 bottom-24 z-40 flex justify-center px-4">
          <div className="max-w-xl rounded-full border border-rose-300 bg-rose-100 px-4 py-3 text-center text-sm font-medium text-rose-700 shadow-lg">
            {actionError}
          </div>
        </div>
      ) : null}

      {toastMessage ? (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="max-w-sm rounded-full border border-[#b8985b]/50 bg-[#b8985b]/15 px-4 py-3 text-center text-sm font-medium text-[#b8985b] shadow-lg">
            {toastMessage}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WishlistPage;
