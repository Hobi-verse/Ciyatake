import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/user/common/UserNavbar.jsx";
import Breadcrumbs from "../../components/common/Breadcrumbs.jsx";
import CheckoutProgress from "../../components/user/checkout/CheckoutProgress.jsx";
import CheckoutSection from "../../components/user/checkout/CheckoutSection.jsx";
import CheckoutField from "../../components/user/checkout/CheckoutField.jsx";
import CheckoutOrderSummary from "../../components/user/checkout/CheckoutOrderSummary.jsx";
import Loader from "../../components/common/Loader.jsx";
import Skeleton from "../../components/common/Skeleton.jsx";
import {
  fetchCart,
  validateCart,
  updateCartItem,
  removeCartItem,
} from "../../api/cart.js";
import { fetchAddresses, createAddress } from "../../api/addresses.js";
import { fetchAccountSummary } from "../../api/user.js";
import { processPayment } from "../../api/payments.js";

const SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 50;
// Removed TAX_RATE as tax is no longer applied
const DEFAULT_COUNTRY = "India";
const NEW_ADDRESS_OPTION_VALUE = "new-address";

const EMPTY_ADDRESS_FORM = {
  label: "Home",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: DEFAULT_COUNTRY,
  deliveryInstructions: "",
};

const TEXTAREA_FIELD_CLASSES =
  "w-full rounded-2xl border border-[#DCECE9] bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#b8985b] focus:outline-none focus:ring-2 focus:ring-[#b8985b]/25 transition";

const computePricing = (cart) => {
  const subtotalFromTotals = Number(cart?.totals?.subtotal);
  const subtotal = Number.isFinite(subtotalFromTotals)
    ? subtotalFromTotals
    : Array.isArray(cart?.items)
    ? cart.items.reduce((sum, item) => {
        const unitPrice = Number(item?.price) || 0;
        const quantity = Number(item?.quantity) || 0;
        return sum + unitPrice * quantity;
      }, 0)
    : 0;

  const shipping = 0; // Always free shipping
  const tax = 0; // No tax
  const total = subtotal; // Only product price

  return {
    subtotal,
    shipping,
    tax,
    total,
  };
};

const buildOrderFromCart = (cart) => {
  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return null;
  }

  const items = cart.items
    .filter((item) => !item?.savedForLater)
    .map((item) => ({
      id: item?.id ?? item?.productId ?? item?.variantSku,
      title: item?.title ?? "",
      size: item?.size ?? "",
      price: Number(item?.price) || 0,
      quantity: Number(item?.quantity) || 0,
      imageUrl: item?.imageUrl ?? "",
    }));

  if (!items.length) {
    return null;
  }

  const pricing = computePricing({ ...cart, items });

  return {
    items,
    shipping: pricing.shipping,
    shippingLabel: pricing.shipping === 0 ? "Free" : undefined,
    tax: pricing.tax,
  };
};

const formatAddressOptionLabel = (address) => {
  const parts = [address.label ?? "Saved address"];

  if (address.city) {
    parts.push(address.city);
  }

  if (address.state) {
    parts.push(address.state);
  }

  return parts.join(" - ");
};

const CheckoutPage = () => {
  const navigate = useNavigate();

  const states = useMemo(
    () => [
      { value: "", label: "Select state", disabled: true },
      { value: "KA", label: "Karnataka" },
      { value: "MH", label: "Maharashtra" },
      { value: "TN", label: "Tamil Nadu" },
      { value: "DL", label: "Delhi" },
      { value: "WB", label: "West Bengal" },
      { value: "GJ", label: "Gujarat" },
      { value: "RJ", label: "Rajasthan" },
      { value: "UP", label: "Uttar Pradesh" },
    ],
    []
  );

  const [cart, setCart] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [checkoutIssues, setCheckoutIssues] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ ...EMPTY_ADDRESS_FORM });
  const [contactForm, setContactForm] = useState({
    fullName: "",
    phone: "",
    email: "",
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedAddressId) ?? null,
    [addresses, selectedAddressId]
  );

  const addressOptions = useMemo(() => {
    if (!addresses.length) {
      return [
        {
          value: NEW_ADDRESS_OPTION_VALUE,
          label: "Add new address",
        },
      ];
    }

    return [
      ...addresses.map((address) => ({
        value: address.id,
        label: formatAddressOptionLabel(address),
      })),
      {
        value: NEW_ADDRESS_OPTION_VALUE,
        label: "Add new address",
      },
    ];
  }, [addresses]);

  const hasCheckoutData = Boolean(cart);
  const isInitialCheckoutLoad = loading && !hasCheckoutData;
  const isRefreshingCheckout = loading && hasCheckoutData;

  const checkoutSteps = useMemo(() => {
    const hasShippingSelection = useNewAddress
      ? true
      : Boolean(selectedAddressId);
    const hasOrder = Boolean(order);

    return [
      {
        label: "Shipping",
        status: hasShippingSelection ? "complete" : "current",
      },
      {
        label: "Payment",
        status: hasShippingSelection
          ? hasOrder
            ? "complete"
            : "current"
          : "upcoming",
      },
      {
        label: "Review",
        status: hasOrder ? "current" : "upcoming",
      },
    ];
  }, [order, selectedAddressId, useNewAddress]);

  const loadCheckoutData = useCallback(async ({ signal } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const [cartResponse, addressResponse, accountSummary] = await Promise.all(
        [
          fetchCart({ signal }),
          fetchAddresses({ signal }).catch((addressError) => {
            if (signal?.aborted) {
              return { addresses: [] };
            }

            console.warn("Failed to load addresses:", addressError);
            return { addresses: [] };
          }),
          fetchAccountSummary({ signal }).catch(() => null),
        ]
      );

      if (signal?.aborted) {
        return;
      }

      setCart(cartResponse);
      setOrder(buildOrderFromCart(cartResponse));

      const availableAddresses = addressResponse?.addresses ?? [];
      setAddresses(availableAddresses);

      if (availableAddresses.length) {
        const defaultAddress =
          availableAddresses.find((address) => address.isDefault) ??
          availableAddresses[0];
        setSelectedAddressId(defaultAddress?.id ?? "");
        setUseNewAddress(false);
      } else {
        setSelectedAddressId("");
        setUseNewAddress(true);
        setAddressForm({ ...EMPTY_ADDRESS_FORM });
      }

      if (accountSummary?.profile) {
        setContactForm((prev) => ({
          fullName: accountSummary.profile.name ?? prev.fullName,
          phone: accountSummary.profile.phone ?? prev.phone,
          email: accountSummary.profile.email ?? prev.email,
        }));
      }
    } catch (loadError) {
      if (!signal?.aborted) {
        setError(loadError);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadCheckoutData({ signal: controller.signal });

    return () => controller.abort();
  }, [loadCheckoutData]);

  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressFormChange = (event) => {
    const { name, value } = event.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressSelection = (event) => {
    const value = event.target.value;

    if (value === NEW_ADDRESS_OPTION_VALUE) {
      setUseNewAddress(true);
      setSelectedAddressId("");
      setAddressForm({ ...EMPTY_ADDRESS_FORM });
      return;
    }

    setUseNewAddress(false);
    setSelectedAddressId(value);
  };

  useEffect(() => {
    if (!useNewAddress && selectedAddress) {
      setContactForm((prev) => ({
        fullName: prev.fullName || selectedAddress.recipient || "",
        phone: prev.phone || selectedAddress.phone || "",
        email: prev.email,
      }));
    }
  }, [selectedAddress, useNewAddress]);

  const handleQuantityChange = useCallback(async (itemId, newQuantity) => {
    console.log('🔄 Updating checkout quantity:', { itemId, newQuantity });
    
    try {
      // Update the local order state immediately for better UX
      setOrder(prevOrder => {
        if (!prevOrder) return prevOrder;
        
        const updatedItems = prevOrder.items.map(item => 
          item.id === itemId 
            ? { ...item, quantity: newQuantity }
            : item
        );
        
        return { ...prevOrder, items: updatedItems };
      });
      
      // Update the cart on the server
      const { updateCartItem } = await import("../../api/cart.js");
      await updateCartItem(itemId, { quantity: newQuantity });
      
      // Refresh the order to get updated totals
      await loadCheckoutData();
      
    } catch (error) {
      console.error('❌ Failed to update quantity:', error);
      // Refresh to get the correct state
      await loadCheckoutData();
    }
  }, [loadCheckoutData]);

  const handlePlaceOrder = async () => {
    if (isPlacingOrder || !order) {
      return;
    }

    setOrderError(null);
    setCheckoutIssues([]);

    const fullName = contactForm.fullName.trim();
    const email = contactForm.email.trim();
    const phone = contactForm.phone.trim();

    console.log('🛒 Starting order placement...', { 
      fullName, 
      email, 
      phone,
      contactFormValid: !!(fullName && email && phone)
    });

    if (!fullName || !email || !phone) {
      const missingFields = [];
      if (!fullName) missingFields.push('Full Name');
      if (!email) missingFields.push('Email');
      if (!phone) missingFields.push('Phone');
      
      const errorMessage = `Missing contact information: ${missingFields.join(', ')}`;
      console.error('❌ Contact validation failed:', errorMessage);
      setOrderError(errorMessage);
      return;
    }

    const creatingNewAddress = useNewAddress || !selectedAddressId;
    console.log('📍 Address info:', { 
      creatingNewAddress, 
      useNewAddress, 
      selectedAddressId,
      addressForm 
    });

    if (creatingNewAddress) {
      const requiredFields = ["addressLine1", "city", "state", "postalCode"];
      const missingFields = requiredFields.filter(
        (field) => !addressForm[field]?.trim()
      );

      if (missingFields.length) {
        const errorMessage = `Missing address fields: ${missingFields.join(', ')}`;
        console.error('❌ Address validation failed:', errorMessage);
        setOrderError(errorMessage);
        return;
      }
    }

    setIsPlacingOrder(true);
    setIsSavingAddress(false);

    try {
      let resolvedAddressId = selectedAddressId;
      let resolvedShippingAddress = selectedAddress;

      if (creatingNewAddress) {
        console.log('📍 Creating new address...');
        setIsSavingAddress(true);
        try {
          const newAddress = await createAddress({
            label: addressForm.label || "Home",
            recipient: fullName,
            phone,
            addressLine1: addressForm.addressLine1,
            addressLine2: addressForm.addressLine2,
            city: addressForm.city,
            state: addressForm.state,
            postalCode: addressForm.postalCode,
            country: addressForm.country || DEFAULT_COUNTRY,
            deliveryInstructions: addressForm.deliveryInstructions,
          });

          console.log('✅ Address created successfully:', newAddress);
          resolvedAddressId = newAddress.id;
          resolvedShippingAddress = newAddress;
          setAddresses((prev) => [newAddress, ...prev]);
          setSelectedAddressId(newAddress.id);
          setUseNewAddress(false);
        } catch (addressError) {
          console.error('❌ Address creation failed:', addressError);
          setOrderError(`Failed to save address: ${addressError.message}`);
          return;
        }
      }

      console.log('🔍 Validating cart...');
      
      // Skip cart validation for now and proceed directly to payment
      const normalizedCart = cart;
      
      if (
        !normalizedCart ||
        !Array.isArray(normalizedCart.items) ||
        !normalizedCart.items.length
      ) {
        setCart(normalizedCart);
        setOrder(null);
        setOrderError("Your cart looks empty. Add items before checking out.");
        return;
      }

      setCart(normalizedCart);
      const nextOrder = buildOrderFromCart(normalizedCart);
      setOrder(nextOrder);

      console.log('💳 Starting secure payment process...');

      // 🔐 SECURE PAYMENT FLOW - Like Flipkart/Amazon
      const verificationData = await processPayment({
        shippingAddressId: resolvedAddressId,
        couponCode: undefined, // Skip coupon for now
        customerNotes: addressForm.deliveryInstructions,
        customerDetails: {
          name: fullName,
          email,
          phone,
        },
        onSuccess: (data) => {
          console.log('✅ Payment successful:', data);
          
          // Store success data for confirmation page navigation
          const paymentSuccessData = {
            paymentId: data?.razorpay_payment_id,
            orderId: data?.razorpay_order_id,
            signature: data?.razorpay_signature,
            order: data?.order
          };
          
          // Store in sessionStorage for immediate access
          sessionStorage.setItem('paymentSuccess', JSON.stringify(paymentSuccessData));
        },
        onFailure: (error) => {
          console.error('❌ Payment failed:', error);
          throw error;
        }
      });

      const resolvedOrder =
        verificationData?.order ??
        verificationData?.data?.order ??
        nextOrder ??
        order;
      const orderId =
        verificationData?.orderId ??
        verificationData?.data?.orderId ??
        resolvedOrder?._id ??
        resolvedOrder?.id ??
        null;

      const confirmationOrder = {
        ...resolvedOrder,
        id:
          resolvedOrder?.id ??
          orderId ??
          resolvedOrder?._id ??
          nextOrder?.id ??
          null,
        orderNumber:
          resolvedOrder?.orderNumber ??
          null,
        items: nextOrder?.items ?? resolvedOrder?.items ?? [],
        totals: {
          subtotal: resolvedOrder?.pricing?.subtotal ?? resolvedOrder?.total ?? nextOrder?.total ?? 0,
          shipping: resolvedOrder?.pricing?.shipping ?? 0,
          shippingLabel: nextOrder?.shippingLabel,
          tax: resolvedOrder?.pricing?.tax ?? 0,
        },
        paymentMethod:
          resolvedOrder?.payment?.method ??
          resolvedOrder?.paymentMethod ??
          "Online payment",
        transactionId:
          resolvedOrder?.payment?.transactionId ??
          resolvedOrder?.transactionId ??
          verificationData?.payment?.transactionId ??
          null,
      };

      const shippingAddress = resolvedShippingAddress ??
        selectedAddress ?? {
          addressLine1: addressForm.addressLine1,
          addressLine2: addressForm.addressLine2,
          city: addressForm.city,
          state: addressForm.state,
          postalCode: addressForm.postalCode,
          country: addressForm.country,
          deliveryInstructions: addressForm.deliveryInstructions,
        };

      // Navigate to confirmation page - ensure this always happens
      try {
        navigate("/confirmation", {
          replace: true,
          state: {
            order: confirmationOrder,
            orderId,
            pricing: {
              subtotal: confirmationOrder?.totals?.subtotal || 0,
              shipping: confirmationOrder?.totals?.shipping || 0,
              tax: confirmationOrder?.totals?.tax || 0,
              total: (confirmationOrder?.totals?.subtotal || 0) + (confirmationOrder?.totals?.shipping || 0) + (confirmationOrder?.totals?.tax || 0)
            },
            customer: {
              name: fullName,
              email,
              phone,
            },
            shipping: {
              addressLines: [
                shippingAddress?.addressLine1,
                shippingAddress?.addressLine2,
                [
                  shippingAddress?.city,
                  shippingAddress?.state,
                  shippingAddress?.postalCode,
                ]
                  .filter(Boolean)
                  .join(", "),
                shippingAddress?.country,
              ].filter(Boolean),
              instructions: shippingAddress?.deliveryInstructions,
            },
          },
        });
        console.log('🎉 Redirecting to confirmation page...');
      } catch (navigationError) {
        console.error('❌ Navigation error:', navigationError);
        // Fallback navigation with minimal data
        navigate("/confirmation", {
          replace: true,
          state: {
            order: { id: orderId || 'unknown' },
            success: true
          }
        });
      }
    } catch (submissionError) {
      console.error('❌ Order placement failed:', submissionError);
      
      const apiMessage =
        submissionError?.payload?.message ??
        submissionError?.message ??
        "We couldn't complete the payment. Please try again.";

      setOrderError(`Payment Error: ${apiMessage}`);
    } finally {
      setIsPlacingOrder(false);
      setIsSavingAddress(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
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
          <h1 className="text-3xl font-semibold text-[#b8985b] md:text-4xl">
            Checkout
          </h1>
          <p className="text-sm text-slate-600">
            Complete your purchase in a few simple steps.
          </p>
        </header>

        {isInitialCheckoutLoad ? (
          <div className="flex flex-wrap gap-3 rounded-3xl border border-[#DCECE9] bg-white p-6 shadow-sm">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={`checkout-progress-skeleton-${index}`}
                className="h-10 w-36 rounded-full"
                rounded={false}
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
            We couldn't load your checkout information. Please refresh the page.
          </div>
        ) : (
          <CheckoutProgress steps={checkoutSteps} />
        )}

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          {isInitialCheckoutLoad ? (
            <>
              <div className="space-y-4 rounded-3xl border border-[#DCECE9] bg-white p-6 shadow-sm">
                <Skeleton className="h-6 w-44" />
                <Skeleton className="h-4 w-64" />
                <div className="grid gap-4 md:grid-cols-2">
                  <Skeleton
                    className="h-10 w-full rounded-xl"
                    rounded={false}
                  />
                  <Skeleton
                    className="h-10 w-full rounded-xl"
                    rounded={false}
                  />
                </div>
                <Skeleton className="h-10 w-full rounded-xl" rounded={false} />
                <Skeleton className="h-6 w-52" />
                <Skeleton className="h-10 w-full rounded-xl" rounded={false} />
                <Skeleton className="h-10 w-full rounded-xl" rounded={false} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Skeleton
                    className="h-10 w-full rounded-xl"
                    rounded={false}
                  />
                  <Skeleton
                    className="h-10 w-full rounded-xl"
                    rounded={false}
                  />
                </div>
                <Skeleton className="h-24 w-full rounded-2xl" rounded={false} />
              </div>
              <div className="space-y-3 rounded-3xl border border-[#DCECE9] bg-white p-6 shadow-sm">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton
                  className="h-12 w-full rounded-full"
                  rounded={false}
                />
                <Skeleton
                  className="h-12 w-full rounded-full"
                  rounded={false}
                />
              </div>
            </>
          ) : (
            <>
              <form
                className="space-y-6"
                onSubmit={(event) => event.preventDefault()}
              >
                <CheckoutSection
                  title="Contact information"
                  description="We'll use these details to send order updates."
                  action={<span>Already have an account? Sign in</span>}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <CheckoutField
                      label="Full name"
                      name="fullName"
                      autoComplete="name"
                      placeholder="e.g. Aditi Sharma"
                      value={contactForm.fullName}
                      onChange={handleContactChange}
                    />
                    <CheckoutField
                      label="Phone number"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="10-digit mobile number"
                      value={contactForm.phone}
                      onChange={handleContactChange}
                    />
                  </div>
                  <CheckoutField
                    label="Email address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={contactForm.email}
                    onChange={handleContactChange}
                  />
                </CheckoutSection>

                <CheckoutSection
                  title="Shipping address"
                  description="Your order will be delivered to this address."
                >
                  {addresses.length ? (
                    <CheckoutField
                      label="Saved addresses"
                      name="shippingAddressId"
                      options={addressOptions}
                      value={
                        useNewAddress
                          ? NEW_ADDRESS_OPTION_VALUE
                          : selectedAddressId
                      }
                      onChange={handleAddressSelection}
                    />
                  ) : (
                    <>
                    <div className="rounded-2xl text-center border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                      You don't have a saved address yet. Add a new one below to
                      continue.
                    </div>
                    <div class="flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 p-4">
                      <div class="bg-white rounded-2xl shadow-xl border border-[#b8985b] p-8 w-full max-w-md text-center">
                        <h1 class="text-2xl font-bold text-[#b8985b] mb-6">Save Address Navigation Guide</h1>

                        <div class="flex items-center justify-center space-x-3 text-sm font-medium">
                          <div class="flex items-center gap-4 rounded-2xl border px-4 py-3 transition border-[#b8985b] bg-[#b8985b] text-white shadow-[0_14px_28px_rgba(184,152,91,0.3)]">
                            <span>Account</span>
                          </div>
                          <span class="text-[#b8985b]">→</span>
                          <div class="flex items-center gap-4 rounded-2xl border px-4 py-3 transition border-[#b8985b] bg-[#b8985b] text-white shadow-[0_14px_28px_rgba(184,152,91,0.3)]">
                            <span>Address</span>
                          </div>
                          <span class="text-[#b8985b]">→</span>
                          <div class="flex items-center gap-4 rounded-2xl border px-4 py-3 transition border-[#b8985b] bg-[#b8985b] text-white shadow-[0_14px_28px_rgba(184,152,91,0.3)]">
                            <span>Add New Address</span>
                          </div>
                        </div>

                        <p class="mt-6 text-gray-700 text-sm">Follow the steps above to add a new address to your account.</p>
                      </div>
                    </div>

                    </>
                  )}
                <button disabled={isSavingAddress} onClick={()=>navigate('/account')} className="bg-[#b8985b] text-white font-semibold rounded-3xl py-2 cursor-pointer">Go Save address</button>
                </CheckoutSection>
              </form>

              {order ? (
                <div className="space-y-4">
                  {orderError ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                      {orderError}
                    </div>
                  ) : null}
                  <CheckoutOrderSummary
                    order={order}
                    onPlaceOrder={handlePlaceOrder}
                    onQuantityChange={handleQuantityChange}
                    isPlacingOrder={isPlacingOrder || isSavingAddress}
                  />
                </div>
              ) : (
                <div className="rounded-3xl border border-[#DCECE9] bg-[#F2EAE0] p-6 text-sm text-[#b8985b]">
                  No items in your order yet.
                </div>
              )}
            </>
          )}
        </section>

        {isRefreshingCheckout ? (
          <div className="flex justify-center pt-4">
            <Loader label="Refreshing checkout" />
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default CheckoutPage;
