import { Link } from "react-router-dom";
import { formatINR } from "../../../utils/currency.js";
import arrowRightIcon from "../../../assets/icons/arrow-right.svg";
import OrderSummaryRow from "../../common/OrderSummaryRow.jsx";

const OrderSummary = ({
  subtotal = 0,
  estimatedTax = 0,
  shippingLabel = "Free",
  checkoutPath = "/checkout",
}) => {
  const total = subtotal + estimatedTax;

  return (
    <aside className="space-y-6 rounded-3xl border border-white/5 bg-[#0b1f19] p-6 shadow-[0_20px_45px_rgba(8,35,25,0.45)]">
      <div>
        <h2 className="text-lg font-semibold text-white">Order Summary</h2>
      </div>

      <div className="space-y-3 text-sm">
        <OrderSummaryRow label="Subtotal" value={formatINR(subtotal)} />
        <OrderSummaryRow label="Shipping" value={shippingLabel} />
        <OrderSummaryRow
          label="Estimated Tax"
          value={formatINR(estimatedTax)}
        />
      </div>

      <OrderSummaryRow
        label={
          <span className="text-sm font-semibold text-emerald-200/80">
            Total
          </span>
        }
        value={formatINR(total)}
        emphasis
      />

      <Link
        to={checkoutPath}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
      >
        Proceed to Checkout
        <img src={arrowRightIcon} alt="" aria-hidden className="h-4 w-4" />
      </Link>
    </aside>
  );
};

export default OrderSummary;
