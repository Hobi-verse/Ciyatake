const SectionCard = ({
  title,
  description,
  action,
  children,
  className = "",
}) => (
  <section
    className={`rounded-3xl border border-[#DCECE9] bg-white p-6 shadow-[0_20px_45px_rgba(0,0,0,0.08)] backdrop-blur ${className}`.trim()}
  >
    {(title || description || action) && (
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          {title ? (
            <h2 className="text-lg font-semibold text-[#b8985b] md:text-xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="text-sm text-slate-600">{description}</p>
          ) : null}
        </div>
        {action ? <div className="text-sm text-[#b8985b]">{action}</div> : null}
      </header>
    )}

    {children ? <div className="mt-4 space-y-4">{children}</div> : null}
  </section>
);

export default SectionCard;
