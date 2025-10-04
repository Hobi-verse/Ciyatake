import SectionCard from "./SectionCard.jsx";
import AddressCard from "./AddressCard.jsx";

const AddressesSection = ({ addresses }) => {
  const hasAddresses = Array.isArray(addresses) && addresses.length > 0;

  return (
    <SectionCard
      title="Saved addresses"
      description="Manage where you want your orders to arrive."
    >
      {hasAddresses ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-emerald-200/40 bg-white/5 p-6 text-sm text-emerald-200/70">
          Add a shipping address to speed up checkout.
        </div>
      )}
      <button
        type="button"
        className="mt-4 inline-flex items-center justify-center rounded-full border border-emerald-300/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100 transition hover:border-emerald-200"
      >
        Add new address
      </button>
    </SectionCard>
  );
};

export default AddressesSection;
