import { useEffect, useMemo, useState } from "react";

const ADDRESS_TYPES = [
  { value: "home", label: "Home" },
  { value: "office", label: "Office" },
  { value: "other", label: "Other" },
];

const buildInitialState = (address) => ({
  label: address?.label ?? "",
  recipient: address?.recipient ?? "",
  phone: address?.phone ?? "",
  addressLine1: address?.addressLine1 ?? "",
  addressLine2: address?.addressLine2 ?? "",
  city: address?.city ?? "",
  state: address?.state ?? "",
  postalCode: address?.postalCode ?? "",
  country: address?.country ?? "India",
  type: address?.type ?? "home",
  deliveryInstructions: address?.deliveryInstructions ?? "",
  isDefault: Boolean(address?.isDefault),
});

const useFormState = (open, initialAddress) => {
  const initialState = useMemo(
    () => buildInitialState(initialAddress),
    [initialAddress]
  );

  const [formValues, setFormValues] = useState(initialState);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (open) {
      setFormValues(buildInitialState(initialAddress));
      setFormError("");
    }
  }, [open, initialAddress]);

  return { formValues, setFormValues, formError, setFormError };
};

const validateForm = (values) => {
  if (!values.label.trim()) {
    return "Give this address a label.";
  }

  if (!values.recipient.trim()) {
    return "Please mention the recipient name.";
  }

  if (!/^\d{10}$/.test(values.phone.trim())) {
    return "Enter a valid 10-digit phone number.";
  }

  if (!values.addressLine1.trim()) {
    return "Address line 1 is required.";
  }

  if (!values.city.trim()) {
    return "City is required.";
  }

  if (!values.state.trim()) {
    return "State is required.";
  }

  if (!/^\d{6}$/.test(values.postalCode.trim())) {
    return "Enter a valid 6-digit PIN code.";
  }

  return "";
};

const AddressDialog = ({
  open,
  mode = "create",
  initialAddress,
  onClose,
  onSubmit,
  saving = false,
  error = "",
}) => {
  const { formValues, setFormValues, formError, setFormError } = useFormState(
    open,
    initialAddress
  );

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    const validationError = validateForm(formValues);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");

    const payload = {
      label: formValues.label.trim(),
      recipient: formValues.recipient.trim(),
      phone: formValues.phone.trim(),
      addressLine1: formValues.addressLine1.trim(),
      addressLine2: formValues.addressLine2.trim(),
      city: formValues.city.trim(),
      state: formValues.state.trim(),
      postalCode: formValues.postalCode.trim(),
      country: formValues.country.trim() || "India",
      type: formValues.type,
      deliveryInstructions: formValues.deliveryInstructions.trim(),
      isDefault: formValues.isDefault,
    };

    await onSubmit?.(payload);
  };

  const dialogTitle = mode === "edit" ? "Edit address" : "Add address";

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="address-dialog-title"
      onClick={handleOverlayClick}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-3xl border border-[#DCECE9] bg-white p-6 text-slate-700 shadow-[0_36px_60px_rgba(15,23,42,0.12)]"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Shipping details
            </p>
            <h2
              className="mt-2 text-2xl font-semibold text-slate-900"
              id="address-dialog-title"
            >
              {dialogTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:border-[#b8985b] hover:text-[#b8985b]"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-2 block text-slate-600">Label</span>
            <input
              type="text"
              name="label"
              value={formValues.label}
              onChange={handleChange}
              placeholder="Home, Office..."
              className="w-full rounded-2xl border border-[#DCECE9] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#b8985b] focus:ring-2 focus:ring-[#b8985b]/20"
              required
            />
          </label>

          <label className="text-sm">
            <span className="mb-2 block text-slate-600">Recipient</span>
            <input
              type="text"
              name="recipient"
              value={formValues.recipient}
              onChange={handleChange}
              placeholder="Full name"
              className="w-full rounded-2xl border border-[#DCECE9] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#b8985b] focus:ring-2 focus:ring-[#b8985b]/20"
              required
            />
          </label>

          <label className="text-sm">
            <span className="mb-2 block text-slate-600">Phone</span>
            <input
              type="tel"
              name="phone"
              inputMode="numeric"
              pattern="\d{10}"
              value={formValues.phone}
              onChange={handleChange}
              placeholder="10-digit mobile"
              className="w-full rounded-2xl border border-[#DCECE9] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#b8985b] focus:ring-2 focus:ring-[#b8985b]/20"
              required
            />
          </label>

          <label className="text-sm">
            <span className="mb-2 block text-slate-600">Type</span>
            <select
              name="type"
              value={formValues.type}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#DCECE9] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#b8985b] focus:ring-2 focus:ring-[#b8985b]/20"
            >
              {ADDRESS_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="md:col-span-2 text-sm">
            <span className="mb-2 block text-slate-600">Address line 1</span>
            <input
              type="text"
              name="addressLine1"
              value={formValues.addressLine1}
              onChange={handleChange}
              placeholder="Flat, house no., building"
              className="w-full rounded-2xl border border-[#DCECE9] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#b8985b] focus:ring-2 focus:ring-[#b8985b]/20"
              required
            />
          </label>

          <label className="md:col-span-2 text-sm">
            <span className="mb-2 block text-slate-600">Address line 2</span>
            <input
              type="text"
              name="addressLine2"
              value={formValues.addressLine2}
              onChange={handleChange}
              placeholder="Area, landmark (optional)"
              className="w-full rounded-2xl border border-[#DCECE9] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#b8985b] focus:ring-2 focus:ring-[#b8985b]/20"
            />
          </label>

          <label className="text-sm">
            <span className="mb-2 block text-slate-600">City</span>
            <input
              type="text"
              name="city"
              value={formValues.city}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#DCECE9] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#b8985b] focus:ring-2 focus:ring-[#b8985b]/20"
              required
            />
          </label>

          <label className="text-sm">
            <span className="mb-2 block text-slate-600">State</span>
            <input
              type="text"
              name="state"
              value={formValues.state}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#DCECE9] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#b8985b] focus:ring-2 focus:ring-[#b8985b]/20"
              required
            />
          </label>

          <label className="text-sm">
            <span className="mb-2 block text-slate-600">PIN code</span>
            <input
              type="text"
              name="postalCode"
              value={formValues.postalCode}
              onChange={handleChange}
              maxLength={6}
              pattern="\d{6}"
              placeholder="6-digit"
              className="w-full rounded-2xl border border-[#DCECE9] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#b8985b] focus:ring-2 focus:ring-[#b8985b]/20"
              required
            />
          </label>

          <label className="text-sm">
            <span className="mb-2 block text-slate-600">Country</span>
            <input
              type="text"
              name="country"
              value={formValues.country}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#DCECE9] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#b8985b] focus:ring-2 focus:ring-[#b8985b]/20"
            />
          </label>

          <label className="md:col-span-2 text-sm">
            <span className="mb-2 block text-slate-600">
              Delivery instructions
            </span>
            <textarea
              name="deliveryInstructions"
              value={formValues.deliveryInstructions}
              onChange={handleChange}
              rows={2}
              placeholder="Share any notes for the courier (optional)"
              className="w-full rounded-2xl border border-[#DCECE9] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#b8985b] focus:ring-2 focus:ring-[#b8985b]/20"
            />
          </label>

          <label className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 md:col-span-2">
            <input
              type="checkbox"
              name="isDefault"
              checked={formValues.isDefault}
              onChange={handleChange}
              className="h-4 w-4 rounded border border-slate-300 text-[#b8985b] focus:ring-[#b8985b]/30"
            />
            Make this my default address
          </label>
        </div>

        {formError ? (
          <p className="mt-4 text-sm text-rose-500">{formError}</p>
        ) : null}
        {error ? <p className="mt-1 text-sm text-rose-500">{error}</p> : null}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            We deliver to most Indian PIN codes. Double-check before you place
            an order.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-w-[8rem] items-center justify-center rounded-full border border-[#b8985b] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#b8985b] transition hover:bg-[#b8985b] hover:text-white disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : mode === "edit"
              ? "Save changes"
              : "Save address"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressDialog;
