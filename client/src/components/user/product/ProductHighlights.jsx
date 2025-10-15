const ProductHighlights = ({ highlights = [] }) => {
  if (!highlights.length) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-[#DCECE9] bg-white p-6 shadow-[0_24px_56px_rgba(15,23,42,0.08)]">
      <h2 className="text-lg font-semibold text-slate-900">Highlights</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {highlights.map((highlight) => (
          <li
            key={highlight.title}
            className="rounded-2xl border border-[#DCECE9] bg-[#F2EAE0] p-4"
          >
            <p className="text-sm font-semibold text-slate-900">
              {highlight.title}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {highlight.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProductHighlights;
