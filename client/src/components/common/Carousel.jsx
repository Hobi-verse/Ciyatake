import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* -----------------------------------
    IMAGE COMPONENT (Re-used from your code)
    - Lazy loading
    - Skeleton loader
    - Optional CTA button
----------------------------------- */
function ImageWithSkeleton({ slide, navigate }) {
  const [loaded, setLoaded] = useState(false);

  const handleClick = () => {
    if (slide.link) navigate(slide.link);
  };

  return (
    <div
      className="relative w-full h-full cursor-pointer"
      onClick={handleClick}
    >
      {/* Skeleton Loader */}
      {!loaded && (
        <div className="absolute top-0 left-0 w-full h-full bg-[#ececec] animate-pulse"></div>
      )}

      {/* Lazy Loaded Image */}
      <img
        src={slide.img}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        alt="Carousel Slide"
      />

      {/* Optional CTA Button */}
      {slide.cta && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Don't trigger the div's click
            handleClick();
          }}
          className="absolute bottom-5 left-5 bg-white text-gray-800 font-semibold px-4 py-2 rounded-full shadow hover:scale-105 transition"
        >
          {slide.cta}
        </button>
      )}
    </div>
  );
}

/* -----------------------------------
    NEW CAROUSEL COMPONENT
    - No Swiper.js
    - Uses React Hooks + Tailwind
    - Replicates all features:
      - Autoplay
      - Looping
      - Custom arrows
      - Clickable pagination
----------------------------------- */
export default function Carousel({ slides, autoplayDelay = 5000 }) {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  // Navigation functions
  const prev = () =>
    setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));

  const next = () =>
    setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

  // Autoplay functionality
  useEffect(() => {
    if (autoplayDelay) {
      const timer = setTimeout(next, autoplayDelay);
      return () => clearTimeout(timer);
    }
  }, [current, autoplayDelay, slides.length]); // Reset timer on slide change

  return (
    <div className="w-full rounded-xl overflow-hidden relative">
      {/* This is the "track" that moves. 
        We use CSS transform to slide it left or right.
      */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {/* All slides are rendered, but only the current one is visible */}
        {slides.map((slide, i) => (
          <div
            key={i}
            className="min-w-full h-[240px] md:h-[320px] lg:h-[380px] flex-shrink-0"
          >
            <ImageWithSkeleton slide={slide} navigate={navigate} />
          </div>
        ))}
      </div>

      {/* CUSTOM FLIPKART WHITE CIRCULAR ARROWS */}
      <button
        onClick={prev}
        className="arrow-left absolute top-1/2 left-2 transform -translate-y-1/2 bg-white w-10 h-10 rounded-full shadow flex items-center justify-center z-20"
      >
        <span className="text-xl font-bold text-gray-700">{`<`}</span>
      </button>

      <button
        onClick={next}
        className="arrow-right absolute top-1/2 right-2 transform -translate-y-1/2 bg-white w-10 h-10 rounded-full shadow flex items-center justify-center z-20"
      >
        <span className="text-xl font-bold text-gray-700">{`>`}</span>
      </button>

      {/* PAGINATION DOTS */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === current ? "bg-white scale-125" : "bg-white/50"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}