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
      className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center bg-gradient-to-br from-black/50 via-black/40 to-black/30 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto py-4 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="address-dialog-title"
      onClick={handleOverlayClick}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl my-auto rounded-3xl border-2 border-[#DCECE9]/50 bg-gradient-to-br from-white to-[#FCFAF7] p-4 sm:p-8 text-slate-700 shadow-[0_40px_80px_rgba(184,152,91,0.15)] transform transition-all duration-300 ease-out relative"
      >
        <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-4 pb-4 sm:pb-6 border-b border-[#DCECE9]/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#b8985b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#b8985b]">
                Shipping details
              </p>
            </div>
            <h2
              className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text"
              id="address-dialog-title"
            >
              {dialogTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onClose?.()}
            className="group rounded-full border-2 border-slate-200 bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-600 transition-all duration-300 hover:border-[#b8985b] hover:text-white hover:bg-[#b8985b] hover:shadow-lg hover:shadow-[#b8985b]/20 hover:scale-105"
          >
            Close
          </button>
        </div>

        <div className="mt-5 sm:mt-6 grid gap-4 sm:gap-5 md:grid-cols-2">
          <label className="group text-xs sm:text-sm">
            <span className="mb-2 flex items-center gap-1.5 text-slate-700 font-semibold">
              <svg className="w-3.5 h-3.5 text-[#b8985b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Label
            </span>
            <input
              type="text"
              name="label"
              value={formValues.label}
              onChange={handleChange}
              placeholder="Home, Office..."
              className="w-full rounded-2xl border-2 border-[#DCECE9] bg-white/50 px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#b8985b] focus:bg-white focus:ring-4 focus:ring-[#b8985b]/10 hover:border-[#DCECE9]/80 hover:bg-white"
              required
            />
          </label>

          <label className="group text-xs sm:text-sm">
            <span className="mb-2 flex items-center gap-1.5 text-slate-700 font-semibold">
              <svg className="w-3.5 h-3.5 text-[#b8985b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Recipient
            </span>
            <input
              type="text"
              name="recipient"
              value={formValues.recipient}
              onChange={handleChange}
              placeholder="Full name"
              className="w-full rounded-2xl border-2 border-[#DCECE9] bg-white/50 px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#b8985b] focus:bg-white focus:ring-4 focus:ring-[#b8985b]/10 hover:border-[#DCECE9]/80 hover:bg-white"
              required
            />
          </label>

          <label className="group text-xs sm:text-sm">
            <span className="mb-2 flex items-center gap-1.5 text-slate-700 font-semibold">
              <svg className="w-3.5 h-3.5 text-[#b8985b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Phone
            </span>
            <input
              type="tel"
              name="phone"
              inputMode="numeric"
              pattern="\d{10}"
              value={formValues.phone}
              onChange={handleChange}
              placeholder="10-digit mobile"
              className="w-full rounded-2xl border-2 border-[#DCECE9] bg-white/50 px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#b8985b] focus:bg-white focus:ring-4 focus:ring-[#b8985b]/10 hover:border-[#DCECE9]/80 hover:bg-white"
              required
            />
          </label>

          <label className="group text-xs sm:text-sm">
            <span className="mb-2 flex items-center gap-1.5 text-slate-700 font-semibold">
              <svg className="w-3.5 h-3.5 text-[#b8985b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Type
            </span>
            <div className="z-10">
              <select
                name="type"
                value={formValues.type}
                onChange={handleChange}
                className="w-full appearance-none rounded-2xl border-2 border-[#DCECE9] bg-white px-4 py-2.5 sm:py-3 pr-10 text-xs sm:text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#b8985b] focus:bg-white focus:ring-4 focus:ring-[#b8985b]/10 hover:border-[#DCECE9]/80 cursor-pointer relative z-auto"
              >
                {ADDRESS_TYPES.map((option) => (
                  <option key={option.value} value={option.value} className="bg-white py-2 relative ">
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 z-20">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </label>

          <label className="md:col-span-2 text-xs sm:text-sm">
            <span className="mb-2 flex items-center gap-1.5 text-slate-700 font-semibold">
              <svg className="w-3.5 h-3.5 text-[#b8985b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Address line 1
            </span>
            <input
              type="text"
              name="addressLine1"
              value={formValues.addressLine1}
              onChange={handleChange}
              placeholder="Flat, house no., building"
              className="w-full rounded-2xl border-2 border-[#DCECE9] bg-white/50 px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#b8985b] focus:bg-white focus:ring-4 focus:ring-[#b8985b]/10 hover:border-[#DCECE9]/80 hover:bg-white"
              required
            />
          </label>

          <label className="md:col-span-2 text-xs sm:text-sm">
            <span className="mb-2 flex items-center gap-1.5 text-slate-600 font-medium">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              Address line 2 <span className="text-[0.6rem] text-slate-400 lowercase">(optional)</span>
            </span>
            <input
              type="text"
              name="addressLine2"
              value={formValues.addressLine2}
              onChange={handleChange}
              placeholder="Area, landmark (optional)"
              className="w-full rounded-2xl border-2 border-[#DCECE9] bg-white/50 px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#b8985b] focus:bg-white focus:ring-4 focus:ring-[#b8985b]/10 hover:border-[#DCECE9]/80 hover:bg-white"
            />
          </label>

          <label className="text-xs sm:text-sm">
            <span className="mb-2 flex items-center gap-1.5 text-slate-700 font-semibold">
              <svg className="w-3.5 h-3.5 text-[#b8985b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              City
            </span>
            <input
              type="text"
              name="city"
              value={formValues.city}
              onChange={handleChange}
              placeholder="e.g., Mumbai"
              className="w-full rounded-2xl border-2 border-[#DCECE9] bg-white/50 px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#b8985b] focus:bg-white focus:ring-4 focus:ring-[#b8985b]/10 hover:border-[#DCECE9]/80 hover:bg-white"
              required
            />
          </label>

          <label className="text-xs sm:text-sm">
            <span className="mb-2 flex items-center gap-1.5 text-slate-700 font-semibold">
              <svg className="w-3.5 h-3.5 text-[#b8985b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              State
            </span>
            <input
              type="text"
              name="state"
              value={formValues.state}
              onChange={handleChange}
              placeholder="e.g., Maharashtra"
              className="w-full rounded-2xl border-2 border-[#DCECE9] bg-white/50 px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#b8985b] focus:bg-white focus:ring-4 focus:ring-[#b8985b]/10 hover:border-[#DCECE9]/80 hover:bg-white"
              required
            />
          </label>

          <label className="text-xs sm:text-sm">
            <span className="mb-2 flex items-center gap-1.5 text-slate-700 font-semibold">
              <svg className="w-3.5 h-3.5 text-[#b8985b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              PIN code
            </span>
            <input
              type="text"
              name="postalCode"
              value={formValues.postalCode}
              onChange={handleChange}
              maxLength={6}
              pattern="\d{6}"
              placeholder="6-digit PIN"
              className="w-full rounded-2xl border-2 border-[#DCECE9] bg-white/50 px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#b8985b] focus:bg-white focus:ring-4 focus:ring-[#b8985b]/10 hover:border-[#DCECE9]/80 hover:bg-white"
              required
            />
          </label>

          <label className="text-xs sm:text-sm">
            <span className="mb-2 flex items-center gap-1.5 text-slate-700 font-semibold">
              <svg className="w-3.5 h-3.5 text-[#b8985b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Country
            </span>
            <input
              type="text"
              name="country"
              value={formValues.country}
              onChange={handleChange}
              className="w-full rounded-2xl border-2 border-[#DCECE9] bg-white/50 px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#b8985b] focus:bg-white focus:ring-4 focus:ring-[#b8985b]/10 hover:border-[#DCECE9]/80 hover:bg-white"
            />
          </label>

          <label className="md:col-span-2 text-xs sm:text-sm">
            <span className="mb-2 flex items-center gap-1.5 text-slate-600 font-medium">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Delivery instructions <span className="text-[0.6rem] text-slate-400 lowercase">(optional)</span>
            </span>
            <textarea
              name="deliveryInstructions"
              value={formValues.deliveryInstructions}
              onChange={handleChange}
              rows={3}
              placeholder="Share any notes for the courier (optional)"
              className="w-full rounded-2xl border-2 border-[#DCECE9] bg-white/50 px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 outline-none transition-all duration-300 focus:border-[#b8985b] focus:bg-white focus:ring-4 focus:ring-[#b8985b]/10 hover:border-[#DCECE9]/80 hover:bg-white resize-none"
            />
          </label>

          <label className="flex items-center gap-3 md:col-span-2 group cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                name="isDefault"
                checked={formValues.isDefault}
                onChange={handleChange}
                className="peer h-5 w-5 rounded-lg border-2 border-[#DCECE9] text-[#b8985b] cursor-pointer transition-all duration-300 focus:ring-4 focus:ring-[#b8985b]/20 checked:bg-[#b8985b] checked:border-[#b8985b] hover:border-[#b8985b]"
              />
              <svg className="absolute top-1 left-1 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 group-hover:text-[#b8985b] transition-colors">
              Make this my default address
            </span>
          </label>
        </div>

        {formError ? (
          <div className="mt-4 sm:mt-5 flex items-start gap-2 rounded-2xl bg-rose-50 border-2 border-rose-200 p-3 sm:p-4">
            <svg className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs sm:text-sm text-rose-700 font-medium">{formError}</p>
          </div>
        ) : null}
        {error ? (
          <div className="mt-2 flex items-start gap-2 rounded-2xl bg-rose-50 border-2 border-rose-200 p-3 sm:p-4">
            <svg className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs sm:text-sm text-rose-700 font-medium">{error}</p>
          </div>
        ) : null}

        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t-2 border-[#DCECE9]/50 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-start gap-2 text-[0.65rem] sm:text-xs text-slate-500 order-2 sm:order-1">
            <svg className="w-4 h-4 text-[#b8985b] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="leading-relaxed">
              We deliver to most Indian PIN codes. Double-check before you place an order.
            </p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="group order-1 sm:order-2 inline-flex w-full sm:w-auto sm:min-w-[10rem] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#b8985b] to-[#a9894f] border-2 border-[#b8985b] px-5 sm:px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white transition-all duration-300 hover:shadow-xl hover:shadow-[#b8985b]/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                {mode === "edit" ? "Save changes" : "Save address"}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressDialog;
