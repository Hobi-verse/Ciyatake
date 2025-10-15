const CheckoutSection = ({ title, description, children, action }) => {
  return (
    <section className="rounded-3xl border border-[#DCECE9] bg-white p-6 shadow-[0_28px_64px_rgba(15,23,42,0.1)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          ) : null}
        </div>
        {action ? <div className="text-sm text-slate-500">{action}</div> : null}
      </div>

      <div className="mt-6 grid gap-4">{children}</div>
    </section>
  );
};

export default CheckoutSection;
