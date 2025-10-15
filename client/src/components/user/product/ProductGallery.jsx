import { useState } from "react";

const ProductGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  if (!images.length) {
    return null;
  }

  const activeImage = images[activeIndex] ?? images[0];

  return (
    <section className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[#DCECE9] bg-white shadow-[0_28px_60px_rgba(15,23,42,0.08)]">
        <div className="flex h-full w-full items-center justify-center">
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            className="max-h-full max-w-full object-contain"
            loading={activeIndex === 0 ? "eager" : "lazy"}
          />
        </div>
        {activeImage.tag ? (
          <span className="absolute right-4 top-4 rounded-full bg-[#b8985b] px-3 py-1 text-xs font-semibold text-white">
            {activeImage.tag}
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`overflow-hidden rounded-2xl border p-1 transition ${
              index === activeIndex
                ? "border-[#b8985b] bg-[#b8985b]/15"
                : "border-[#DCECE9] bg-white hover:border-[#b8985b]/50"
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <img
              src={image.thumbnail ?? image.src}
              alt=""
              aria-hidden="true"
              className="h-20 w-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default ProductGallery;
