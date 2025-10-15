import RatingDisplay from "../../../common/RatingDisplay.jsx";

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const statusStyles = {
  approved: "bg-[#c3dedd] text-[#2f4a55]",
  pending: "bg-[#F6C7B3] text-[#8a4b3c]",
  rejected: "bg-rose-100 text-rose-600",
};

const MyReviewsSection = ({
  reviews,
  loading,
  error,
  onRefresh,
  onLoadMore,
  hasMore,
  onEdit,
  onDelete,
}) => {
  const renderReview = (review) => {
    const statusStyle =
      statusStyles[review.status] ?? "bg-[#DCECE9] text-slate-700";

    return (
      <article
        key={review.id}
        className="rounded-3xl border border-[#DCECE9] bg-white p-5 shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3">
                {review.product?.image ? (
                  <img
                    src={review.product.image}
                    alt={review.product?.title || "Product image"}
                    className="h-12 w-12 rounded-xl object-cover"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />
                ) : null}
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {review.product?.title || "Product"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Reviewed on {formatDate(review.createdAt) || "recently"}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${statusStyle}`}
              >
                {review.status}
              </span>
              {review.isVerifiedPurchase ? (
                <span className="rounded-full border border-[#b8985b]/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#b8985b]">
                  Verified purchase
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <RatingDisplay
                rating={review.rating}
                size="sm"
                showCount={false}
              />
              <span className="text-xs text-slate-500">
                {review.rating.toFixed(1)} out of 5
              </span>
            </div>

            {review.title ? (
              <p className="text-sm font-semibold text-slate-900">
                {review.title}
              </p>
            ) : null}

            <p className="text-sm leading-relaxed text-slate-600">
              {review.comment}
            </p>

            {review.adminResponse?.message ? (
              <div className="rounded-2xl border border-[#DCECE9] bg-[#F2EAE0] p-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Ciyatake team</p>
                <p className="mt-1 leading-relaxed">
                  {review.adminResponse.message}
                </p>
              </div>
            ) : null}

            {review.rejectionReason ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-600">
                <p className="font-semibold">Why it was rejected</p>
                <p className="mt-1 leading-relaxed">{review.rejectionReason}</p>
              </div>
            ) : null}
          </div>

          <div className="grid gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 md:ml-6">
            <button
              type="button"
              onClick={() => onEdit?.(review)}
              className="rounded-full border border-[#b8985b] px-3 py-1 transition hover:bg-[#b8985b] hover:text-white"
            >
              Edit review
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(review)}
              className="rounded-full border border-rose-300 px-3 py-1 text-rose-500 transition hover:bg-rose-100"
            >
              Delete
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section className="rounded-3xl border border-[#DCECE9] bg-white p-6 shadow-[0_28px_60px_rgba(15,23,42,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            My reviews
          </p>
          <h2 className="text-xl font-semibold text-slate-900">
            Your product feedback
          </h2>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-full border border-[#b8985b] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#b8985b] transition hover:bg-[#b8985b] hover:text-white"
        >
          Refresh
        </button>
      </div>

      {loading && !reviews.length ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-3xl border border-[#DCECE9] bg-[#F2EAE0]/70 p-5"
            >
              <div className="mb-3 h-4 w-1/4 rounded bg-white/60" />
              <div className="mb-2 h-4 rounded bg-white/60" />
              <div className="h-16 rounded bg-white/60" />
            </div>
          ))}
        </div>
      ) : null}

      {!loading && error ? (
        <div className="mt-6 space-y-3 rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-600">
          <p>{error}</p>
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-full border border-rose-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500 transition hover:bg-rose-100"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!loading && !error && !reviews.length ? (
        <div className="mt-6 rounded-3xl border border-dashed border-[#c3dedd] bg-[#F2EAE0] p-6 text-center text-sm text-slate-600">
          You haven't shared any reviews yet. Head to a product page to write
          one.
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {reviews.map((review) => renderReview(review))}
      </div>

      {hasMore ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full border border-[#b8985b] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#b8985b] transition hover:bg-[#b8985b] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      ) : null}
    </section>
  );
};

export default MyReviewsSection;
