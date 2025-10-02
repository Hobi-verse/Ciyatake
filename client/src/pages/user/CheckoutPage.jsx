import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/user/common/UserNavbar.jsx";
import Breadcrumbs from "../../components/common/Breadcrumbs.jsx";
import CheckoutProgress from "../../components/user/checkout/CheckoutProgress.jsx";
import CheckoutSection from "../../components/user/checkout/CheckoutSection.jsx";
import CheckoutField from "../../components/user/checkout/CheckoutField.jsx";
import CheckoutOrderSummary from "../../components/user/checkout/CheckoutOrderSummary.jsx";
import { fetchCheckoutSummary, placeOrder } from "../../api/orders.js";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const states = useMemo(
    () => [
      { value: "", label: "Select state" },
      { value: "KA", label: "Karnataka" },
      { value: "MH", label: "Maharashtra" },
      { value: "TN", label: "Tamil Nadu" },
      { value: "DL", label: "Delhi" },
      { value: "WB", label: "West Bengal" },
    ],
    []
  );

  const [steps, setSteps] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const loadCheckoutSummary = useCallback(async ({ signal } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchCheckoutSummary({ signal });
      if (signal?.aborted) {
        return;
      }

      const loadedSteps = Array.isArray(response?.steps) ? response.steps : [];
      const loadedOrder = response?.order ?? null;

      setSteps(loadedSteps);
      setOrder(loadedOrder);
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
    loadCheckoutSummary({ signal: controller.signal });

    return () => controller.abort();
  }, [loadCheckoutSummary]);

  const handlePlaceOrder = async (summaryOrder = order) => {
    if (isPlacingOrder || !summaryOrder) {
      return;
    }

    setIsPlacingOrder(true);
    setOrderError(null);

    const now = new Date();
    const orderNumber = `CYA-${now.getFullYear().toString().slice(-2)}${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}${now
      .getDate()
      .toString()
      .padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const transactionId = `TXN${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;
    const subtotal = summaryOrder.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const payload = {
      ...summaryOrder,
      id: orderNumber,
      placedOn: now.toISOString(),
      transactionId,
      paymentMethod: summaryOrder.paymentMethod ?? "UPI •••• 3821",
      totals: {
        subtotal,
        shipping: summaryOrder.shipping ?? 0,
        shippingLabel: summaryOrder.shippingLabel,
        tax: summaryOrder.tax ?? 0,
      },
    };

    try {
      const response = await placeOrder(payload);
      const responseOrder = response?.order ?? payload;

      navigate("/confirmation", {
        replace: true,
        state: { order: responseOrder },
      });
    } catch (submissionError) {
      setOrderError(
        submissionError?.message ?? "We couldn't place your order just yet."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07150f] text-emerald-50">
      <UserNavbar />
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-12">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Shopping Cart", to: "/cart" },
            { label: "Checkout" },
          ]}
        />

        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Checkout
          </h1>
          <p className="text-sm text-emerald-200/80">
            Complete your purchase in a few simple steps.
          </p>
        </header>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-emerald-200/70">
            Loading your checkout details...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-300/40 bg-rose-500/10 p-6 text-sm text-rose-100">
            We couldn&apos;t load your checkout summary. Please refresh the
            page.
          </div>
        ) : (
          <CheckoutProgress steps={steps} />
        )}

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <form className="space-y-6">
            <CheckoutSection
              title="Contact information"
              description="We’ll use these details to send order updates."
              action={<span>Already have an account? Sign in</span>}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <CheckoutField
                  label="Full name"
                  name="fullName"
                  autoComplete="name"
                  placeholder="e.g. Aditi Sharma"
                />
                <CheckoutField
                  label="Phone number"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="10-digit mobile number"
                />
              </div>
              <CheckoutField
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
            </CheckoutSection>

            <CheckoutSection
              title="Shipping address"
              description="Your order will be delivered to this address."
            >
              <CheckoutField
                label="Address line 1"
                name="address1"
                autoComplete="address-line1"
                placeholder="Apartment, house number, street"
              />
              <CheckoutField
                label="Address line 2"
                name="address2"
                autoComplete="address-line2"
                placeholder="Landmark, area"
                optional
              />

              <div className="grid gap-4 md:grid-cols-2">
                <CheckoutField
                  label="City"
                  name="city"
                  autoComplete="address-level2"
                  placeholder="City"
                />
                <CheckoutField
                  label="State"
                  name="state"
                  options={states.map((option, index) => ({
                    ...option,
                    disabled: index === 0,
                  }))}
                  defaultValue=""
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <CheckoutField
                  label="Postal code"
                  name="postalCode"
                  autoComplete="postal-code"
                  placeholder="PIN code"
                />
                <CheckoutField
                  label="Country"
                  name="country"
                  options={[
                    {
                      value: "",
                      label: "Select country",
                      disabled: true,
                    },
                    { value: "IN", label: "India" },
                  ]}
                  defaultValue="IN"
                />
              </div>
            </CheckoutSection>
          </form>

          {order ? (
            <div className="space-y-4">
              {orderError ? (
                <div className="rounded-2xl border border-rose-300/40 bg-rose-500/10 p-4 text-sm text-rose-100">
                  {orderError}
                </div>
              ) : null}
              <CheckoutOrderSummary
                order={order}
                onPlaceOrder={handlePlaceOrder}
                isPlacingOrder={isPlacingOrder}
              />
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-emerald-200/70">
              No items in your order yet.
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CheckoutPage;
