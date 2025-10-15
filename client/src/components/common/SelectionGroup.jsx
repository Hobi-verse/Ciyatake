const SelectionGroup = ({ items = [], value, onChange, multiple = false }) => {
  const handleSelect = (itemValue) => {
    if (multiple) {
      const nextValues = new Set(Array.isArray(value) ? value : []);
      if (nextValues.has(itemValue)) {
        nextValues.delete(itemValue);
      } else {
        nextValues.add(itemValue);
      }
      onChange?.(Array.from(nextValues));
    } else {
      onChange?.(itemValue);
    }
  };

  const isSelected = (itemValue) =>
    multiple ? value?.includes(itemValue) : value === itemValue;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = isSelected(item.value);
        return (
          <button
            key={item.value ?? item.label}
            type="button"
            onClick={() => handleSelect(item.value)}
            aria-pressed={active}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-[#b8985b] focus-visible:outline-offset-2 ${
              active
                ? "border-[#b8985b] bg-[#b8985b]/15 text-[#b8985b]"
                : "border-[#DCECE9] bg-white text-slate-600 hover:border-[#b8985b]/50 hover:bg-[#DCECE9]/60"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default SelectionGroup;
