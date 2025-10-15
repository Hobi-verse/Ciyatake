import SectionCard from "./SectionCard.jsx";
import AddressCard from "./AddressCard.jsx";

const toneClassMap = {
  info: "text-slate-600",
  success: "text-[#4f7a7f]",
  error: "text-rose-500",
};

const AddressesSection = ({
  addresses,
  loading,
  error,
  onRefresh,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
  pendingAction,
  statusMessage,
  statusTone = "info",
}) => {
  const hasAddresses = Array.isArray(addresses) && addresses.length > 0;
  const statusClass = toneClassMap[statusTone] ?? toneClassMap.info;

  return (
    <SectionCard
      title="Saved addresses"
      description="Manage where you want your orders to arrive."
    >
      {loading ? (
        <div className="rounded-2xl border border-[#DCECE9] bg-[#F2EAE0] p-6 text-sm text-slate-600">
          Loading your addresses...
        </div>
      ) : error ? (
        <div className="space-y-3">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
            {error}
          </div>
          {typeof onRefresh === "function" ? (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center justify-center rounded-full border border-[#b8985b] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#b8985b] transition hover:bg-[#b8985b] hover:text-white"
            >
              Retry
            </button>
          ) : null}
        </div>
      ) : hasAddresses ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={onEdit}
              onDelete={onDelete}
              onSetDefault={onSetDefault}
              actionState={pendingAction}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#c3dedd] bg-[#F6C7B3]/20 p-6 text-sm text-slate-600">
          Add a shipping address to speed up checkout.
        </div>
      )}

      {statusMessage && !loading && !error ? (
        <p className={`mt-4 text-xs ${statusClass}`}>{statusMessage}</p>
      ) : null}

      {typeof onAdd === "function" ? (
        <button
          type="button"
          onClick={onAdd}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-[#b8985b] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#b8985b] transition hover:bg-[#b8985b] hover:text-white"
        >
          Add new address
        </button>
      ) : null}
    </SectionCard>
  );
};

export default AddressesSection;
