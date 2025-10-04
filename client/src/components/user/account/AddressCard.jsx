const AddressCard = ({ address }) => {
  if (!address) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{address.label}</p>
          <p className="text-xs text-emerald-200/70">{address.recipient}</p>
        </div>
        {address.isDefault ? (
          <span className="rounded-full border border-emerald-300/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
            Default
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm text-emerald-100">
        {address.addressLine1}
        {address.addressLine2 ? `, ${address.addressLine2}` : ""}
      </p>
      <p className="text-sm text-emerald-100">
        {address.city}, {address.state} {address.postalCode}
      </p>
      <p className="text-xs text-emerald-200/70">{address.country}</p>
      <p className="mt-2 text-xs text-emerald-200/70">Phone: {address.phone}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/80">
        <button
          type="button"
          className="rounded-full border border-white/10 px-3 py-1 transition hover:border-emerald-200/70 hover:text-emerald-100"
        >
          Edit
        </button>
        <button
          type="button"
          className="rounded-full border border-white/10 px-3 py-1 transition hover:border-emerald-200/70 hover:text-emerald-100"
        >
          Set default
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
