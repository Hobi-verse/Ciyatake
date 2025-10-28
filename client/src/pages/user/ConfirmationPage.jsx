import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserNavbar from "../../components/user/common/UserNavbar.jsx";
import Breadcrumbs from "../../components/common/Breadcrumbs.jsx";
import OrderItemCard from "../../components/common/OrderItemCard.jsx";
import OrderSummaryRow from "../../components/common/OrderSummaryRow.jsx";
import Loader from "../../components/common/Loader.jsx";
import Skeleton from "../../components/common/Skeleton.jsx";
import { formatINR } from "../../utils/currency.js";
import arrowRightIcon from "../../assets/icons/arrow-right.svg";
import { fetchOrderById } from "../../api/orders.js";

const StatusBadge = ({ status }) => {
  const styles = {
    complete: "bg-[#b8985b]/15 text-[#b8985b] border-[#b8985b]/40",
    current: "bg-[#DCECE9] text-[#b8985b] border-[#b8985b]/40",
    upcoming: "bg-white text-slate-500 border-[#DCECE9]",
  };

  return (
    <span
      className={`inline-flex h-8 min-w-[7rem] items-center justify-center rounded-full border px-3 text-xs font-semibold uppercase tracking-[0.2em] ${
        styles[status] || styles.upcoming
      }`}
    >
      {status === "complete"
        ? "Completed"
        : status === "current"
        ? "In progress"
        : "Upcoming"}
    </span>
  );
};

const TimelineStep = ({ step, index, isLast }) => (
  <article className="flex gap-4">
    <div className="relative flex flex-col items-center">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${
          step.status === "complete"
            ? "border-[#b8985b]/60 bg-[#b8985b]/15 text-[#b8985b]"
            : step.status === "current"
            ? "border-[#b8985b]/60 bg-[#F2EAE0] text-[#b8985b]"
            : "border-[#DCECE9] bg-white text-slate-500"
        }`}
      >
        {index + 1}
      </div>
      {isLast ? null : (
        <div
          className="mt-1 h-full w-px flex-1 bg-gradient-to-b from-[#DCECE9] to-transparent"
          aria-hidden
        />
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-[#b8985b]">{step.title}</h3>
      <p className="text-xs text-slate-500">{step.description}</p>
      <StatusBadge status={step.status} />
    </div>
  </article>
);

const InfoBlock = ({ title, children, description }) => (
  <section className="space-y-4 rounded-3xl border border-[#DCECE9] bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
    <header className="space-y-1">
      <h2 className="text-lg font-semibold text-[#b8985b]">{title}</h2>
      {description ? (
        <p className="text-sm text-slate-600">{description}</p>
      ) : null}
    </header>
    <div className="space-y-4 text-sm text-slate-700">{children}</div>
  </section>
);

const formatPlacedOn = (placedOn) => {
  if (!placedOn) {
    return null;
  }

  const parsed = new Date(placedOn);
  if (Number.isNaN(parsed.getTime())) {
    return placedOn;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
};

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const runtimeData = location.state ?? {};
  const [confirmationData, setConfirmationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadConfirmation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Only fetch if we have a valid order ID
      if (!runtimeData.order?.id) {
        console.log('⚠️ No order ID available, using runtime data only');
        setConfirmationData({ order: runtimeData.order });
        return;
      }
      
      const response = await fetchOrderById(runtimeData.order.id);
      setConfirmationData(response);
    } catch (apiError) {
      setError(apiError);
    } finally {
      setLoading(false);
    }
  }, [runtimeData.order?.id]);

  useEffect(() => {
    loadConfirmation();
  }, [loadConfirmation]);

  const order = useMemo(() => {
    const fallbackOrder = confirmationData?.order ?? {};
    const runtimeOrder = runtimeData.order ?? {};
    return {
      ...fallbackOrder,
      ...runtimeOrder,
      totals: {
        ...fallbackOrder.totals,
        ...(runtimeOrder.totals ?? {}),
      },
      items: runtimeOrder.items ?? fallbackOrder.items,
    };
  }, [confirmationData?.order, runtimeData.order]);

  const customer = useMemo(() => {
    const fallbackCustomer = confirmationData?.customer ?? {};
    const runtimeCustomer = runtimeData.customer ?? {};
    return { ...fallbackCustomer, ...runtimeCustomer };
  }, [confirmationData?.customer, runtimeData.customer]);

  const shipping = useMemo(() => {
    const fallbackShipping = confirmationData?.shipping ?? {};
    const runtimeShipping = runtimeData.shipping ?? {};
    return {
      ...fallbackShipping,
      addressLines:
        runtimeShipping.addressLines ?? fallbackShipping.addressLines,
      instructions:
        runtimeShipping.instructions ?? fallbackShipping.instructions,
    };
  }, [confirmationData?.shipping, runtimeData.shipping]);

  const support = confirmationData?.support ?? {};
  const nextSteps = confirmationData?.nextSteps ?? [];

  const orderItems = order.items ?? [];
  const totals = order.totals ?? {};
  const subtotal = totals.subtotal ?? 0;
  const shippingCost = totals.shipping ?? 0;
  const shippingLabel =
    shippingCost === 0
      ? totals.shippingLabel ?? "Free"
      : formatINR(shippingCost);
  const tax = totals.tax ?? 0;
  const total = subtotal + shippingCost + tax;

  const placedOnLabel = useMemo(() => {
    const fallbackPlacedOn = confirmationData?.order?.placedOn;
    const value = order.placedOn ?? fallbackPlacedOn;
    return value ? formatPlacedOn(value) : null;
  }, [confirmationData?.order?.placedOn, order.placedOn]);

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleEmailSupport = () => {
    window.open(
      `mailto:${support.email}?subject=Order%20${order.id}`,
      "_blank"
    );
  };

  const greetingName = customer?.name?.split(" ")?.[0] ?? "there";

  const isInitialConfirmationLoad = loading && !confirmationData;
  const isRefreshingConfirmation = loading && Boolean(confirmationData);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <UserNavbar />
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-12">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Checkout", to: "/checkout" },
            { label: "Order confirmed" },
          ]}
        />

        {isInitialConfirmationLoad ? (
          <section className="space-y-6 rounded-3xl border border-[#DCECE9] bg-white p-8 shadow-[0_26px_60px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" rounded={false} />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24 rounded-full" rounded={false} />
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-80 max-w-full" />
                  <Skeleton className="h-4 w-56 max-w-full" />
                </div>
              </div>
              <div className="space-y-3 rounded-3xl border border-[#b8985b]/40 bg-[#F2EAE0] p-4">
                <Skeleton className="h-3 w-20 rounded-full" rounded={false} />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-3 w-32 rounded-full" rounded={false} />
                <Skeleton className="h-3 w-48 rounded-full" rounded={false} />
              </div>
            </div>
          </section>
        ) : error ? (
          <section className="space-y-4 rounded-3xl border border-rose-200 bg-rose-50 p-8 text-sm text-rose-700">
            We couldn&apos;t load your order confirmation. Please try again.
            <button
              type="button"
              onClick={loadConfirmation}
              className="inline-flex items-center justify-center rounded-full border border-rose-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700 transition hover:border-rose-400 hover:bg-rose-100"
            >
              Retry
            </button>
          </section>
        ) : (
          <section className="space-y-6 rounded-3xl border border-[#DCECE9] bg-white p-8 shadow-[0_26px_60px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#b8985b]/15 text-3xl text-[#b8985b] shadow-inner">
                  ✓
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                    Order confirmed
                  </p>
                  <h1 className="text-3xl font-semibold text-[#b8985b] md:text-4xl">
                    Thank you, {greetingName}! Your order is on its way.
                  </h1>
                  <p className="text-sm text-slate-600">
                    We'll email updates to {customer.email}. Delivery window{" "}
                    {order.deliveryWindow ??
                      confirmationData?.order?.deliveryWindow}
                    .
                  </p>
                </div>
              </div>
              <div className="rounded-3xl border border-[#b8985b]/40 bg-[#F2EAE0] p-4 text-sm text-[#b8985b]">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Order ID
                </p>
                <p className="mt-1 text-xl font-semibold text-[#b8985b]">
                  {order.id}
                </p>
                {placedOnLabel ? (
                  <p className="mt-1 text-xs text-slate-500">
                    Placed on {placedOnLabel}
                  </p>
                ) : null}
                {order.transactionId ? (
                  <p className="mt-3 text-xs text-slate-500">
                    Transaction ID:{" "}
                    <span className="text-[#b8985b]">
                      {order.transactionId}
                    </span>
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        )}

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          {isInitialConfirmationLoad ? (
            <>
              <div className="space-y-6">
                <div className="space-y-5 rounded-3xl border border-[#DCECE9] bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-64" />
                  <div className="space-y-5">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={`confirmation-timeline-skeleton-${index}`}
                        className="flex items-start gap-4"
                      >
                        <Skeleton
                          className="h-10 w-10 rounded-full"
                          rounded={false}
                        />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-36" />
                          <Skeleton className="h-3 w-56" />
                          <Skeleton
                            className="h-3 w-28 rounded-full"
                            rounded={false}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-[#DCECE9] bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <div className="grid gap-6 sm:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div
                        key={`confirmation-delivery-skeleton-${index}`}
                        className="space-y-3"
                      >
                        <Skeleton
                          className="h-3 w-32 rounded-full"
                          rounded={false}
                        />
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                    ))}
                  </div>
                  <Skeleton
                    className="h-10 w-full rounded-2xl"
                    rounded={false}
                  />
                </div>

                <div className="space-y-3 rounded-3xl border border-[#DCECE9] bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-9 w-40 rounded-full" rounded={false} />
                </div>
              </div>

              <aside className="space-y-6 rounded-3xl border border-[#DCECE9] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-28 rounded-full" rounded={false} />
                  <Skeleton className="h-5 w-40" />
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={`confirmation-item-skeleton-${index}`}
                      className="space-y-3 rounded-2xl border border-[#DCECE9] p-4"
                    >
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
                <div className="space-y-3 border-t border-[#DCECE9] pt-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`confirmation-summary-skeleton-${index}`}
                      className="flex items-center justify-between"
                    >
                      <Skeleton
                        className="h-3 w-20 rounded-full"
                        rounded={false}
                      />
                      <Skeleton
                        className="h-3 w-16 rounded-full"
                        rounded={false}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24 rounded-full" rounded={false} />
                  <Skeleton className="h-4 w-20 rounded-full" rounded={false} />
                </div>
                <div className="space-y-3 pt-2">
                  <Skeleton
                    className="h-11 w-full rounded-full"
                    rounded={false}
                  />
                  <Skeleton
                    className="h-11 w-full rounded-full"
                    rounded={false}
                  />
                </div>
                <Skeleton
                  className="h-3 w-48 rounded-full self-center"
                  rounded={false}
                />
              </aside>
            </>
          ) : (
            <>
              <div className="space-y-6">
                <InfoBlock
                  title="What's next"
                  description="Track your package as it moves through each stage."
                >
                  <div className="space-y-5">
                    {nextSteps.map((step, index) => (
                      <TimelineStep
                        key={step.title}
                        step={step}
                        index={index}
                        isLast={index === nextSteps.length - 1}
                      />
                    ))}
                  </div>
                </InfoBlock>

                <InfoBlock
                  title="Delivery details"
                  description={`Estimated delivery ${
                    order.deliveryWindow ??
                    confirmationData?.order?.deliveryWindow ??
                    "TBD"
                  }`}
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Shipping address
                      </p>
                      <div className="space-y-1 text-sm text-slate-700">
                        <p className="font-semibold text-[#b8985b]">
                          {customer.name}
                        </p>
                        {shipping.addressLines?.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                        <p className="text-slate-500">{customer.phone}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Payment method
                      </p>
                      <p className="text-sm text-slate-700">
                        {order.paymentMethod ??
                          confirmationData?.order?.paymentMethod ??
                          "Pending"}
                      </p>
                      {order.placedOn ? (
                        <div className="rounded-2xl border border-[#DCECE9] bg-[#F2EAE0] p-4 text-xs text-slate-600">
                          The receipt has been sent to{" "}
                          <span className="text-[#b8985b]">
                            {customer.email}
                          </span>
                          .
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {shipping.instructions ? (
                    <div className="rounded-2xl border border-dashed border-[#b8985b]/40 bg-[#F2EAE0] p-4 text-xs text-slate-600">
                      Delivery note: {shipping.instructions}
                    </div>
                  ) : null}
                </InfoBlock>

                <InfoBlock
                  title="Need help?"
                  description="We're here Monday to Saturday, 10am - 6pm IST."
                >
                  <div className="space-y-3 text-sm text-slate-700">
                    <p>
                      Email us at{" "}
                      <span className="text-[#b8985b]">{support.email}</span> or
                      call {support.phone} if there's anything you need.
                    </p>
                    <button
                      type="button"
                      onClick={handleEmailSupport}
                      className="inline-flex items-center gap-2 rounded-full border border-[#b8985b]/50 bg-[#b8985b]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#b8985b] transition hover:border-[#b8985b] hover:bg-[#b8985b]/20"
                    >
                      Contact support
                      <img
                        src={arrowRightIcon}
                        alt=""
                        className="h-3 w-3"
                        aria-hidden
                      />
                    </button>
                  </div>
                </InfoBlock>
              </div>

              <aside className="space-y-6 rounded-3xl border border-[#DCECE9] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                <header className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                    Order details
                  </p>
                  <h2 className="text-lg font-semibold text-[#b8985b]">
                    Items in this order
                  </h2>
                </header>

                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <OrderItemCard key={item.id} item={item} />
                  ))}
                </div>

                <div className="space-y-3 border-t border-[#DCECE9] pt-4 text-sm text-slate-700">
                  <OrderSummaryRow
                    label="Subtotal"
                    value={formatINR(subtotal)}
                  />
                  <OrderSummaryRow label="Shipping" value={shippingLabel} />
                  <OrderSummaryRow label="Tax" value={formatINR(tax)} />
                </div>
                <OrderSummaryRow
                  label="Total"
                  value={formatINR(total)}
                  emphasis
                />

                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleContinueShopping}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#b8985b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a0824a]"
                  >
                    Continue shopping
                    <img
                      src={arrowRightIcon}
                      alt=""
                      aria-hidden
                      className="h-4 w-4"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={handleEmailSupport}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-[#DCECE9] px-5 py-3 text-sm font-semibold text-[#b8985b] transition hover:bg-[#F2EAE0]"
                  >
                    Need help with this order?
                  </button>
                </div>

                {order.transactionId ? (
                  <p className="text-center text-[0.7rem] text-slate-500">
                    Payment reference{" "}
                    <span className="text-[#b8985b]">
                      {order.transactionId}
                    </span>
                  </p>
                ) : null}
              </aside>
            </>
          )}
        </section>

        {isRefreshingConfirmation ? (
          <div className="flex justify-center pt-6">
            <Loader label="Refreshing confirmation" />
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default ConfirmationPage;
