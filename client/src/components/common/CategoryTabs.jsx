const baseButtonStyles =
  "rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#b8985b]";

const CategoryTabs = ({ items = [], value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((item) => {
      const isActive = item.value === value;
      return (
        <button
          key={item.value ?? item.label}
          type="button"
          onClick={() => onChange?.(item.value, item)}
          className={`${baseButtonStyles} ${
            isActive
              ? "border-[#b8985b] bg-[#b8985b] text-white shadow-[0_12px_24px_rgba(184,152,91,0.25)]"
              : "border-[#DCECE9] bg-white text-slate-600 hover:border-[#b8985b]/60 hover:text-[#b8985b]"
          }`}
        >
          {item.label}
        </button>
      );
    })}
  </div>
);

export default CategoryTabs;
