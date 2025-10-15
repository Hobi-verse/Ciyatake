const SectionHeading = ({ title, eyebrow }) => (
  <div className="mb-6 space-y-2">
    {eyebrow ? (
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b8985b]">
        {eyebrow}
      </p>
    ) : null}
    <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
      {title}
    </h2>
  </div>
);

export default SectionHeading;
