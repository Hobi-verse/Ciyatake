import formatINR from "../../../utils/currency.js";

const PaymentCard = ({ payment }) => {
  if (!payment) {
    return null;
  }

  const details = [
    payment.type === "Credit Card" && payment.last4
      ? `${payment.brand} ending •••• ${payment.last4}`
      : null,
    payment.handle,
    payment.holderName,
    payment.expiry ? `Expires ${payment.expiry}` : null,
  ].filter(Boolean);

  return (
    <div className="rounded-2xl border border-[#DCECE9] bg-white p-4 shadow-[0_16px_32px_rgba(15,23,42,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {payment.brand}
          </p>
          <p className="text-xs text-slate-500">{payment.type}</p>
        </div>
        {payment.isDefault ? (
          <span className="rounded-full border border-[#b8985b]/40 bg-[#b8985b]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#b8985b]">
            Primary
          </span>
        ) : null}
      </div>

      {payment.type === "Wallet" ? (
        <p className="mt-3 text-lg font-semibold text-[#b8985b]">
          Balance: {formatINR(payment.balance)}
        </p>
      ) : null}

      {details.length ? (
        <ul className="mt-3 space-y-1 text-sm text-slate-600">
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        <button
          type="button"
          className="rounded-full border border-[#b8985b] px-3 py-1 transition hover:bg-[#b8985b] hover:text-white"
        >
          Manage
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-300 px-3 py-1 transition hover:border-[#b8985b] hover:text-[#b8985b]"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default PaymentCard;
