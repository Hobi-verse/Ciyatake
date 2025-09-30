import RatingDisplay from "../../common/RatingDisplay.jsx";

const getInitials = (name = "") => {
  const matches = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return matches || "★";
};

const ProductReviewsSummary = ({
  rating = 0,
  reviewCount = 0,
  highlights = [],
}) => {
  const formattedRating = rating.toFixed(1);
  const formattedCount = reviewCount.toLocaleString();

  const reviews = highlights.map((highlight, index) => {
    const name = highlight.author ?? highlight.title ?? `Reviewer ${index + 1}`;
    const comment = highlight.comment ?? highlight.description ?? "";

    return {
      name,
      subtitle: highlight.role ?? highlight.subtitle ?? "Verified Buyer",
      comment,
      rating:
        Number.parseFloat(highlight.rating ?? highlight.score ?? rating) ||
        rating,
    };
  });

  return (
    <section className="rounded-3xl border border-white/5 bg-white/5 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/60">
              Customer Reviews
            </p>
            <h2 className="text-xl font-semibold text-white md:text-2xl">
              Hear it from the community
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-emerald-200/80">
            <RatingDisplay rating={rating} size="lg" showCount={false} />
            <span>
              {formattedRating} out of 5 stars ({formattedCount} ratings)
            </span>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-400"
        >
          Write a review
        </button>
      </div>

      <div className="mt-8 grid gap-4">
        {reviews.length ? (
          reviews.map((review, index) => (
            <article
              key={`${review.name}-${index}`}
              className="rounded-3xl border border-white/5 bg-[#0d221c] p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-semibold text-emerald-200">
                    {getInitials(review.name)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-emerald-100">
                      {review.name}
                    </p>
                    {review.subtitle ? (
                      <p className="text-xs uppercase tracking-[0.15em] text-emerald-200/60">
                        {review.subtitle}
                      </p>
                    ) : null}
                    <p className="pt-1 text-sm text-emerald-200/80">
                      {review.comment}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:ml-6">
                  <RatingDisplay
                    rating={review.rating}
                    size="sm"
                    showCount={false}
                  />
                  <span className="text-xs text-emerald-200/60">
                    {review.rating.toFixed(1)} / 5
                  </span>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-emerald-300/40 bg-[#0d221c] p-6 text-center text-sm text-emerald-200/70">
            No reviews yet. Be the first to share your thoughts.
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductReviewsSummary;
