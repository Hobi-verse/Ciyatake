import { useMemo, useState } from "react";
import UserNavbar from "../../components/user/common/UserNavbar.jsx";
import Breadcrumbs from "../../components/common/Breadcrumbs.jsx";
import CartItem from "../../components/user/cart/CartItem.jsx";
import SavedItem from "../../components/user/cart/SavedItem.jsx";
import OrderSummary from "../../components/user/cart/OrderSummary.jsx";
import cartData from "../../data/cart.json";

const TAX_RATE = 0.1;

const CartPage = () => {
  const [items, setItems] = useState(cartData);

  const cartItems = useMemo(
    () => items.filter((item) => !item.savedForLater),
    [items]
  );

  const savedItems = useMemo(
    () => items.filter((item) => item.savedForLater),
    [items]
  );

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const estimatedTax = Math.round(subtotal * TAX_RATE);
    return {
      subtotal,
      estimatedTax,
    };
  }, [cartItems]);

  const handleQuantityChange = (itemId, quantity) => {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleRemove = (itemId) => {
    setItems((current) => current.filter((item) => item.id !== itemId));
  };

  const handleSaveForLater = (itemId) => {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, savedForLater: true } : item
      )
    );
  };

  const handleMoveToCart = (itemId) => {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, savedForLater: false } : item
      )
    );
  };

  const handleRemoveSaved = (itemId) => {
    handleRemove(itemId);
  };

  return (
    <div className="min-h-screen bg-[#07150f] text-emerald-50">
      <UserNavbar />
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-12">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Shopping Cart" }]}
        />

        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Shopping Cart
          </h1>
          <p className="text-sm text-emerald-200/80">
            Review your items before heading to checkout.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.55fr)]">
          <div className="space-y-4">
            {cartItems.length ? (
              cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                  onSaveForLater={handleSaveForLater}
                />
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-emerald-300/40 bg-white/5 p-10 text-center text-sm text-emerald-200/70">
                Your cart is empty. Browse products to add them here.
              </div>
            )}
          </div>

          <OrderSummary
            subtotal={totals.subtotal}
            estimatedTax={totals.estimatedTax}
            shippingLabel="Free"
          />
        </section>

        <section className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-[0_16px_40px_rgba(8,35,25,0.25)]">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Saved for later
              </h2>
              <p className="text-sm text-emerald-200/75">
                Items you love, ready whenever you are.
              </p>
            </div>
            {savedItems.length ? (
              <span className="rounded-full border border-emerald-300/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-200/70">
                {savedItems.length} item{savedItems.length > 1 ? "s" : ""}
              </span>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4">
            {savedItems.length ? (
              savedItems.map((item) => (
                <SavedItem
                  key={item.id}
                  item={item}
                  onMoveToCart={handleMoveToCart}
                  onRemove={handleRemoveSaved}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-emerald-300/40 bg-[#0d221c] p-8 text-center text-sm text-emerald-200/70">
                No items saved for later yet. Tap "Save for later" on any
                product to add it here.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CartPage;
