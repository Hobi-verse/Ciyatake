import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchAdminReviews,
  approveReview,
  rejectReview,
  respondToReview,
} from "../../api/reviews.js";
import RatingDisplay from "../../components/common/RatingDisplay.jsx";
import { ApiError } from "../../api/client.js";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const ratingOptions = [
  { value: "all", label: "Any rating" },
  { value: "5", label: "5 stars" },
  { value: "4", label: "4 stars" },
  { value: "3", label: "3 stars" },
  { value: "2", label: "2 stars" },
  { value: "1", label: "1 star" },
];

const statusClassMap = {
  approved: "bg-[#f2eae0] text-[#8f7843]",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-rose-100 text-rose-700",
};

const getApiErrorMessage = (error, fallback) => {
  if (error instanceof ApiError) {
    if (typeof error.payload?.message === "string") {
      return error.payload.message;
    }

    if (Array.isArray(error.payload?.errors) && error.payload.errors.length) {
      const first = error.payload.errors[0];
      if (typeof first?.message === "string") {
        return first.message;
      }
    }
  }

  if (typeof error?.message === "string" && error.message.length) {
    return error.message;
  }

  return fallback;
};

const formatDateTime = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatStatusLabel = (value) => {
  if (!value) {
    return "Unknown";
  }

  return value
    .toString()
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    hasMore: false,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [busy, setBusy] = useState({});

  const totalLabel = useMemo(() => {
    const total = Number(pagination.totalReviews ?? 0);
    return Number.isFinite(total) ? total.toLocaleString("en-IN") : "0";
  }, [pagination.totalReviews]);

  const loadReviews = useCallback(
    async ({ page = 1, append = false } = {}) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError("");
      }

      try {
        const query = {
          page,
          limit: 15,
          sortBy: "createdAt",
          sortOrder: "desc",
        };

        if (statusFilter !== "all") {
          query.status = statusFilter;
        }

        if (ratingFilter !== "all") {
          query.rating = ratingFilter;
        }

        if (verifiedOnly) {
          query.verified = "true";
        }

        if (searchTerm) {
          query.search = searchTerm;
        }

        const response = await fetchAdminReviews(query);
        const list = Array.isArray(response.reviews) ? response.reviews : [];

        setReviews((current) => (append ? [...current, ...list] : list));

        setPagination({
          currentPage: response.pagination?.currentPage ?? page,
          totalPages: response.pagination?.totalPages ?? page,
          hasMore: Boolean(response.pagination?.hasMore),
          totalReviews: response.pagination?.totalReviews ?? list.length,
        });
      } catch (apiError) {
        setError(getApiErrorMessage(apiError, "Failed to load reviews."));
        if (!append) {
          setReviews([]);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            hasMore: false,
            totalReviews: 0,
          });
        }
      } finally {
        if (append) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [ratingFilter, searchTerm, statusFilter, verifiedOnly]
  );

  useEffect(() => {
    loadReviews({ page: 1, append: false });
  }, [loadReviews]);

  const setReviewBusy = useCallback((id, state) => {
    setBusy((current) => {
      if (state) {
        return { ...current, [id]: true };
      }

      if (!current[id]) {
        return current;
      }

      const next = { ...current };
      delete next[id];
      return next;
    });
  }, []);

  const handleRefresh = () => {
    loadReviews({ page: 1, append: false });
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchTerm(searchValue.trim());
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setSearchTerm("");
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setRatingFilter("all");
    setVerifiedOnly(false);
    setSearchValue("");
    setSearchTerm("");
  };

  const handleLoadMore = () => {
    if (loadingMore || loading || !pagination.hasMore) {
      return;
    }

    const nextPage = (pagination.currentPage ?? 1) + 1;
    loadReviews({ page: nextPage, append: true });
  };

  const handleApprove = async (reviewId) => {
    if (!reviewId || busy[reviewId]) {
      return;
    }

    setReviewBusy(reviewId, true);

    try {
      const update = await approveReview(reviewId);
      setReviews((current) =>
        current.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                status: "approved",
                rejectionReason: "",
                moderatedAt:
                  update?.moderatedAt ??
                  review.moderatedAt ??
                  new Date().toISOString(),
              }
            : review
        )
      );
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Failed to approve review."));
    } finally {
      setReviewBusy(reviewId, false);
    }
  };

  const handleReject = async (reviewId) => {
    if (!reviewId || busy[reviewId]) {
      return;
    }

    const reasonInput = window.prompt(
      "Add a short reason for rejecting this review (leave blank to use the default message)",
      "Does not meet review guidelines"
    );

    if (reasonInput === null) {
      return;
    }

    const trimmed = reasonInput.trim();

    if (trimmed && trimmed.length < 10) {
      setError(
        "Rejection reason must be at least 10 characters, or leave it blank."
      );
      return;
    }

    if (trimmed.length > 500) {
      setError("Rejection reason must be 500 characters or fewer.");
      return;
    }

    setReviewBusy(reviewId, true);

    try {
      const update = await rejectReview(reviewId, trimmed || undefined);
      const rejectionReason =
        update?.rejectionReason ??
        (trimmed || "Does not meet review guidelines");
      setReviews((current) =>
        current.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                status: "rejected",
                rejectionReason,
                moderatedAt:
                  update?.moderatedAt ??
                  review.moderatedAt ??
                  new Date().toISOString(),
              }
            : review
        )
      );
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Failed to reject review."));
    } finally {
      setReviewBusy(reviewId, false);
    }
  };

  const handleRespond = async (reviewId) => {
    if (!reviewId || busy[reviewId]) {
      return;
    }

    const target = reviews.find((review) => review.id === reviewId);
    const existingMessage = target?.adminResponse?.message ?? "";

    const messageInput = window.prompt(
      "Write a response that will be shared with the customer",
      existingMessage || "Thank you for sharing your feedback with us!"
    );

    if (messageInput === null) {
      return;
    }

    const trimmed = messageInput.trim();

    if (!trimmed) {
      setError("Response message cannot be empty.");
      return;
    }

    if (trimmed.length < 10) {
      setError("Response message must be at least 10 characters long.");
      return;
    }

    if (trimmed.length > 1000) {
      setError("Response message must be 1000 characters or fewer.");
      return;
    }

    setReviewBusy(reviewId, true);

    try {
      const response = await respondToReview(reviewId, trimmed);
      setReviews((current) =>
        current.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                adminResponse: {
                  message: response?.message ?? trimmed,
                  respondedBy: response?.respondedBy ?? "Admin",
                  respondedAt:
                    response?.respondedAt ?? new Date().toISOString(),
                },
              }
            : review
        )
      );
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Failed to add response."));
    } finally {
      setReviewBusy(reviewId, false);
    }
  };

  return (
    <section className="space-y-6 text-slate-800">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#b8985b]">
              Customer insight
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Product reviews
            </h1>
            <p className="text-sm text-slate-500">
              Review and moderate every comment shared by customers in one
              place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
            <span className="rounded-full bg-[#f2eae0] px-4 py-2 text-[#8f7843]">
              {totalLabel} reviews
            </span>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="rounded-full border border-[#dec9a4] px-4 py-2 text-[#8f7843] transition hover:bg-[#f2eae0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="rounded-full border border-slate-200 px-4 py-2 text-slate-500 transition hover:bg-slate-100"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => {
              const active = statusFilter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatusFilter(option.value)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                    active
                      ? "bg-[#b8985b] text-white shadow-lg shadow-[#b8985b]/30"
                      : "border border-[#e6dccb] bg-white text-[#8f7843] hover:bg-[#f2eae0]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Rating
              <select
                value={ratingFilter}
                onChange={(event) => setRatingFilter(event.target.value)}
                className="ml-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600 transition hover:border-[#dec9a4]"
              >
                {ratingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => setVerifiedOnly((current) => !current)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                verifiedOnly
                  ? "border border-[#dec9a4] bg-[#b8985b] text-white"
                  : "border border-slate-200 bg-white text-slate-500 hover:border-[#dec9a4]"
              }`}
            >
              {verifiedOnly ? "Verified only" : "All reviews"}
            </button>
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2"
            >
              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search by title or comment"
                className="w-64 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-[#b8985b] focus:ring-2 focus:ring-[#e6dccb]"
              />
              <button
                type="submit"
                className="rounded-full border border-[#dec9a4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#8f7843] transition hover:bg-[#f2eae0]"
              >
                Search
              </button>
              {searchTerm ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 transition hover:bg-slate-100"
                >
                  Clear
                </button>
              ) : null}
            </form>
          </div>
        </div>
      </header>

      {error ? (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setError("")}
            className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500 transition hover:bg-rose-100"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-[#e6dccb] bg-white shadow-2xl">
        <table className="min-w-full divide-y divide-[#f2eae0] text-left">
          <thead className="bg-[#b8985b] text-xs font-semibold uppercase tracking-[0.35em] text-white">
            <tr>
              <th className="px-6 py-4">Review</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2eae0] text-sm">
            {loading && !reviews.length ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-6 text-center text-[#8f7843]"
                >
                  Loading reviews…
                </td>
              </tr>
            ) : null}

            {!loading && !reviews.length ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-6 text-center text-slate-500"
                >
                  No reviews found. Adjust the filters to see more results.
                </td>
              </tr>
            ) : null}

            {reviews.map((review, index) => {
              const key = review.id || `review-${index}`;
              const isBusy = Boolean(busy[review.id]);
              const ratingValue = Number.isFinite(review.rating)
                ? review.rating
                : Number(review.rating ?? 0);
              const helpfulVotes = Number.isFinite(review.helpfulVotes)
                ? review.helpfulVotes
                : Number(review.helpfulVotes ?? 0);

              return (
                <tr key={key} className="align-top hover:bg-[#f2eae0]">
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {review.title ? (
                        <p className="text-sm font-semibold text-slate-900">
                          {review.title}
                        </p>
                      ) : null}
                      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                        {review.comment || "—"}
                      </p>
                      {review.variant &&
                      (review.variant.size || review.variant.color) ? (
                        <p className="text-xs text-slate-400">
                          {review.variant.size
                            ? `Size: ${review.variant.size}`
                            : null}
                          {review.variant.size && review.variant.color
                            ? " • "
                            : ""}
                          {review.variant.color
                            ? `Colour: ${review.variant.color}`
                            : null}
                        </p>
                      ) : null}
                      {helpfulVotes > 0 ? (
                        <p className="text-xs text-[#8f7843]">
                          {helpfulVotes} helpful vote
                          {helpfulVotes === 1 ? "" : "s"}
                        </p>
                      ) : null}
                      {review.adminResponse?.message ? (
                        <div className="rounded-2xl border border-[#e6dccb] bg-[#f7f1e4] px-3 py-2 text-xs text-[#8f7843]">
                          <p className="font-semibold text-[#5c4a2c]">
                            Your response
                          </p>
                          <p className="mt-1 whitespace-pre-line leading-relaxed">
                            {review.adminResponse.message}
                          </p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#b8985b]">
                            {review.adminResponse.respondedBy || "Admin"} ·{" "}
                            {formatDateTime(review.adminResponse.respondedAt)}
                          </p>
                        </div>
                      ) : null}
                      {review.rejectionReason ? (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-600">
                          <p className="font-semibold">Rejection reason</p>
                          <p className="mt-1 whitespace-pre-line leading-relaxed">
                            {review.rejectionReason}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">
                      {review.product?.title || "Untitled product"}
                    </div>
                    {review.product?.slug ? (
                      <div className="text-xs text-slate-500">
                        /{review.product.slug}
                      </div>
                    ) : null}
                    {review.product?.id ? (
                      <div className="text-xs text-slate-400">
                        ID: {review.product.id}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-700">
                      {review.user?.name || "Anonymous"}
                    </div>
                    {review.user?.email ? (
                      <div className="text-xs text-slate-500">
                        {review.user.email}
                      </div>
                    ) : null}
                    <div className="text-xs text-slate-400">
                      {formatDateTime(review.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <RatingDisplay
                          rating={ratingValue}
                          size="sm"
                          showCount={false}
                        />
                        <span className="text-sm font-medium text-slate-600">
                          {ratingValue.toFixed(1)}
                        </span>
                      </div>
                      {review.isVerifiedPurchase ? (
                        <span className="inline-flex w-max items-center rounded-full border border-[#dec9a4] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8f7843]">
                          Verified
                        </span>
                      ) : null}
                      {Array.isArray(review.images) && review.images.length ? (
                        <span className="text-xs text-slate-400">
                          {review.images.length} image
                          {review.images.length === 1 ? "" : "s"}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <span
                        className={`inline-flex w-max items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          statusClassMap[review.status] ??
                          "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {formatStatusLabel(review.status)}
                      </span>
                      <span className="text-xs text-slate-400">
                        Last update{" "}
                        {formatDateTime(
                          review.moderatedAt ??
                            review.updatedAt ??
                            review.createdAt
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="grid gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
                      {review.status !== "approved" ? (
                        <button
                          type="button"
                          onClick={() => handleApprove(review.id)}
                          disabled={isBusy}
                          className="rounded-full border border-[#dec9a4] px-4 py-2 text-[#8f7843] transition hover:bg-[#f2eae0] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isBusy ? "Working…" : "Approve"}
                        </button>
                      ) : null}
                      {review.status !== "rejected" ? (
                        <button
                          type="button"
                          onClick={() => handleReject(review.id)}
                          disabled={isBusy}
                          className="rounded-full border border-rose-300 px-4 py-2 text-rose-500 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isBusy ? "Working…" : "Reject"}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleRespond(review.id)}
                        disabled={isBusy}
                        className="rounded-full border border-slate-200 px-4 py-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isBusy
                          ? "Working…"
                          : review.adminResponse?.message
                          ? "Edit reply"
                          : "Respond"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination.hasMore ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore || loading}
            className="rounded-full border border-[#dec9a4] px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#8f7843] transition hover:bg-[#f2eae0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      ) : null}
    </section>
  );
};

export default Reviews;
