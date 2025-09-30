import { useMemo, useState } from "react";
import UserNavbar from "../../components/user/common/UserNavbar.jsx";
import Breadcrumbs from "../../components/common/Breadcrumbs.jsx";
import WishlistItem from "../../components/user/wishlist/WishlistItem.jsx";
import ProductGrid from "../../components/common/ProductGrid.jsx";
import wishlistData from "../../data/wishlist.json";
import products from "../../data/products.json";
import heartIcon from "../../assets/icons/heart.svg";

const WishlistPage = () => {
  const [items, setItems] = useState(wishlistData);
  const [toastMessage, setToastMessage] = useState("");

  const handleRemove = (itemId) => {
    setItems((current) => current.filter((item) => item.id !== itemId));
    setToastMessage("Removed from wishlist");
    window.setTimeout(() => setToastMessage(""), 2500);
  };

  const handleAddToCart = (itemId) => {
    setItems((current) => current.filter((item) => item.id !== itemId));
    setToastMessage("Moved to cart");
    window.setTimeout(() => setToastMessage(""), 2500);
  };

  const recommendedProducts = useMemo(() => {
    const wishlistIds = new Set(items.map((item) => item.productId));
    return products
      .filter((product) => !wishlistIds.has(product.id))
      .slice(0, 4);
  }, [items]);

  return (
    <div className="min-h-screen bg-[#07150f] text-emerald-50">
      <UserNavbar />
      <main className="mx-auto max-w-6xl space-y-12 px-4 py-12">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Wishlist" }]}
        />

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Wishlist
          </h1>
          <p className="text-sm text-emerald-200/75">
            Save items you love and move them to your cart whenever you’re
            ready.
          </p>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/80">
            <img src={heartIcon} alt="" className="h-4 w-4" aria-hidden />
            {items.length} saved
          </span>
        </header>

        <section className="space-y-4">
          {items.length ? (
            items.map((item) => (
              <WishlistItem
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
                onRemove={handleRemove}
              />
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-emerald-300/40 bg-white/5 p-10 text-center text-sm text-emerald-200/70">
              Your wishlist is empty. Browse products and tap the heart icon to
              save them here.
            </div>
          )}
        </section>

        {recommendedProducts.length ? (
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                You might also like
              </h2>
              <p className="text-sm text-emerald-200/75">
                Customers who saved these items also considered these picks.
              </p>
            </div>
            <ProductGrid products={recommendedProducts} />
          </section>
        ) : null}
      </main>

      {toastMessage ? (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="max-w-sm rounded-full border border-emerald-300/60 bg-emerald-400/20 px-4 py-3 text-center text-sm font-medium text-emerald-50 shadow-lg">
            {toastMessage}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WishlistPage;
