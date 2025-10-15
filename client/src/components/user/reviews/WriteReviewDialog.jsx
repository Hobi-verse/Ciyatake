import { useEffect, useMemo, useState } from "react";
import { createReview, updateReview } from "../../../api/reviews.js";
import { ApiError } from "../../../api/client.js";

const ratingOptions = [5, 4, 3, 2, 1];

const buildInitialForm = (review) => ({
  rating: review?.rating ?? 5,
  title: review?.title ?? "",
  comment: review?.comment ?? "",
  variantSize: review?.variant?.size ?? "",
  variantColor: review?.variant?.color ?? "",
});

const getApiErrorMessage = (error, fallbackMessage) => {
  if (error instanceof ApiError) {
    return (
      error.payload?.message ||
      error.payload?.error ||
      (Array.isArray(error.payload?.errors)
        ? error.payload.errors[0]?.message
        : null) ||
      fallbackMessage ||
      "Something went wrong"
    );
  }

  return error?.message || fallbackMessage || "Something went wrong";
};

const validateForm = (formValues) => {
  if (!ratingOptions.includes(formValues.rating)) {
    return "Please choose a rating between 1 and 5.";
  }

  if (!formValues.comment || formValues.comment.trim().length < 10) {
    return "Please share at least 10 characters about your experience.";
  }

  if (formValues.comment.length > 2000) {
    return "Your review can be up to 2000 characters.";
  }

  if (formValues.title && formValues.title.length > 200) {
    return "Review title must be 200 characters or less.";
  }

  return "";
};

const WriteReviewDialog = ({
  open,
  mode = "create",
  productId,
  productName,
  defaultOrderId,
  existingReview,
  onClose,
  onSuccess,
}) => {
  const [formValues, setFormValues] = useState(() =>
    buildInitialForm(existingReview)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setFormValues(buildInitialForm(existingReview));
      setError("");
      setSaving(false);
    }
  }, [open, existingReview]);

  const dialogTitle = useMemo(
    () => (mode === "edit" ? "Update your review" : "Write a review"),
    [mode]
  );

  const actionLabel = mode === "edit" ? "Save changes" : "Submit review";

  if (!open) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  const handleRatingChange = (value) => {
    if (saving) {
      return;
    }
    setFormValues((current) => ({
      ...current,
      rating: value,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    const validationError = validateForm(formValues);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!productId) {
      setError("We couldn't identify this product right now.");
      return;
    }

    const payload = {
      rating: formValues.rating,
      title: formValues.title.trim(),
      comment: formValues.comment.trim(),
      images: [],
      variant: {
        size: formValues.variantSize.trim(),
        color: formValues.variantColor.trim(),
      },
    };

    if (!payload.variant.size) {
      delete payload.variant.size;
    }
    if (!payload.variant.color) {
      delete payload.variant.color;
    }
    if (!Object.keys(payload.variant).length) {
      delete payload.variant;
    }

    setSaving(true);
    setError("");

    try {
      let result;
      if (mode === "edit" && existingReview?.id) {
        result = await updateReview(existingReview.id, payload);
      } else {
        result = await createReview({
          ...payload,
          productId,
          orderId: defaultOrderId || undefined,
        });
      }

      setSaving(false);
      onSuccess?.(result);
      onClose?.();
    } catch (apiError) {
      setSaving(false);
      setError(
        getApiErrorMessage(
          apiError,
          mode === "edit"
            ? "We couldn't update your review just yet."
            : "We couldn't submit your review right now."
        )
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="write-review-title"
      onClick={handleOverlayClick}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-3xl border border-[#DCECE9] bg-white p-6 text-slate-700 shadow-[0_36px_72px_rgba(15,23,42,0.12)]"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Share your experience
            </p>
            <h2
              id="write-review-title"
              className="mt-2 text-2xl font-semibold text-slate-900"
            >
              {dialogTitle}
            </h2>
            {productName ? (
              <p className="mt-1 text-sm text-slate-500">{productName}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onClose?.()}
            className="self-start rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:border-[#b8985b] hover:text-[#b8985b]"
          >
            Close
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Rating
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ratingOptions.map((value) => {
                const active = formValues.rating >= value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRatingChange(value)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                      active
                        ? "border-[#b8985b] bg-[#b8985b]/15 text-[#b8985b]"
                        : "border-[#DCECE9] bg-white text-slate-500 hover:border-[#b8985b]/40"
                    }`}
                    aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block text-sm">
            <span className="mb-2 block text-slate-600">Review title</span>
            <input
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              maxLength={200}
              placeholder="A quick headline for your review (optional)"
              className="w-full rounded-2xl border border-[#DCECE9] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#b8985b] focus:ring-2 focus:ring-[#b8985b]/20"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block text-slate-600">Tell us more</span>
            <textarea
              name="comment"
              value={formValues.comment}
              onChange={handleChange}
              rows={5}
              minLength={10}
              maxLength={2000}
              placeholder="How does it fit, feel, and hold up in everyday use?"
              className="w-full rounded-2xl border border-[#DCECE9] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#b8985b] focus:ring-2 focus:ring-[#b8985b]/20"
              required
            />
            <span className="mt-2 block text-xs text-slate-500">
              {formValues.comment.length} / 2000 characters
            </span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-2 block text-slate-600">Size</span>
              <input
                type="text"
                name="variantSize"
                value={formValues.variantSize}
                onChange={handleChange}
                placeholder="Size you picked (optional)"
                className="w-full rounded-2xl border border-[#DCECE9] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#b8985b] focus:ring-2 focus:ring-[#b8985b]/20"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-2 block text-slate-600">Colour</span>
              <input
                type="text"
                name="variantColor"
                value={formValues.variantColor}
                onChange={handleChange}
                placeholder="Colour you chose (optional)"
                className="w-full rounded-2xl border border-[#DCECE9] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#b8985b] focus:ring-2 focus:ring-[#b8985b]/20"
              />
            </label>
          </div>

          <p className="rounded-2xl border border-[#c3dedd] bg-[#c3dedd]/30 px-4 py-3 text-xs text-[#2f4a55]">
            Reviews help other shoppers make confident decisions. Keep your
            feedback honest, constructive, and focused on the product
            experience.
          </p>
        </div>

        {error ? <p className="mt-4 text-sm text-rose-500">{error}</p> : null}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {defaultOrderId ? (
            <span className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Verified purchase
            </span>
          ) : null}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-w-[10rem] items-center justify-center rounded-full border border-[#b8985b] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#b8985b] transition hover:bg-[#b8985b] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : actionLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WriteReviewDialog;
