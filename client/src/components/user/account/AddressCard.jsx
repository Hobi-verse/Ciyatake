const AddressCard = ({
  address,
  onEdit,
  onSetDefault,
  onDelete,
  actionState,
}) => {
  if (!address) {
    return null;
  }

  const pendingType = actionState?.type ?? "";
  const pendingId = actionState?.id ?? "";
  const isPending = pendingId === address.id ? pendingType : "";

  const handleEdit = () => onEdit?.(address);
  const handleDelete = () => onDelete?.(address);
  const handleSetDefault = () => onSetDefault?.(address);

  const showSetDefault = Boolean(!address.isDefault && onSetDefault);
  const showDelete = typeof onDelete === "function";
  const showEdit = typeof onEdit === "function";

  return (
    <div className="rounded-2xl border border-[#DCECE9] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#b8985b]">
            {address.label}
          </p>
          <p className="text-xs text-slate-500">{address.recipient}</p>
        </div>
        {address.isDefault ? (
          <span className="rounded-full border border-[#b8985b] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#b8985b]">
            Default
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm text-slate-700">
        {address.addressLine1}
        {address.addressLine2 ? `, ${address.addressLine2}` : ""}
      </p>
      <p className="text-sm text-slate-700">
        {address.city}, {address.state} {address.postalCode}
      </p>
      <p className="text-xs text-slate-500">{address.country}</p>
      <p className="mt-2 text-xs text-slate-500">Phone: {address.phone}</p>
      {address.type ? (
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">
          {address.type}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {showEdit ? (
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-full border border-[#DCECE9] px-3 py-1 transition hover:border-[#b8985b] hover:text-[#b8985b]"
            disabled={isPending === "delete"}
          >
            Edit
          </button>
        ) : null}
        {showSetDefault ? (
          <button
            type="button"
            onClick={handleSetDefault}
            disabled={isPending === "set-default" || isPending === "delete"}
            className="rounded-full border border-[#DCECE9] px-3 py-1 transition hover:border-[#b8985b] hover:text-[#b8985b] disabled:cursor-not-allowed disabled:border-[#DCECE9] disabled:text-slate-300"
          >
            {isPending === "set-default" ? "Setting..." : "Set default"}
          </button>
        ) : null}
        {showDelete ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending === "delete"}
            className="rounded-full border border-rose-300 px-3 py-1 text-rose-600 transition hover:border-rose-400 hover:text-rose-500 disabled:cursor-not-allowed disabled:border-rose-200 disabled:text-rose-300"
          >
            {isPending === "delete" ? "Deleting..." : "Delete"}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default AddressCard;
