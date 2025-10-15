import SectionCard from "./SectionCard.jsx";
import PaymentCard from "./PaymentCard.jsx";
import formatINR from "../../../utils/currency.js";

const PaymentsSection = ({ paymentMethods, walletBalance = 0 }) => {
  const hasPayments =
    Array.isArray(paymentMethods) && paymentMethods.length > 0;

  return (
    <SectionCard
      title="Payments & wallet"
      description="Keep your payments up to date for one-tap checkout."
    >
      {hasPayments ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {paymentMethods.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#c3dedd] bg-[#F2EAE0] p-6 text-sm text-slate-600">
          Save a payment method to check out faster and earn rewards.
        </div>
      )}
      <div className="mt-4 rounded-2xl border border-[#c3dedd] bg-[#c3dedd]/20 p-4 text-sm text-slate-600">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4f7a7f]">
          Wallet balance
        </p>
        <p className="mt-2 text-2xl font-semibold text-[#b8985b]">
          {formatINR(walletBalance)}
        </p>
        <p className="text-xs text-slate-500">
          Earn more credits when you pay online.
        </p>
      </div>
      <button
        type="button"
        className="mt-4 inline-flex items-center justify-center rounded-full border border-[#b8985b] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#b8985b] transition hover:bg-[#b8985b] hover:text-white"
      >
        Add payment method
      </button>
    </SectionCard>
  );
};

export default PaymentsSection;
