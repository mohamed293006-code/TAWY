import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const AUTOPLAY_INTERVAL = 4000;

function HeroCarousel({ slides }) {
  const containerRef = useRef(null);
  const autoplayRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index) => {
    const container = containerRef.current;
    if (!container) return;
    const slideWidth = container.clientWidth;
    container.scrollTo({ left: slideWidth * index, behavior: "smooth" });
    setActiveIndex(index);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => {
      const next = (prev + 1) % slides.length;
      scrollToIndex(next);
      return next;
    });
  }, [slides.length, scrollToIndex]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => {
      const next = (prev - 1 + slides.length) % slides.length;
      scrollToIndex(next);
      return next;
    });
  }, [slides.length, scrollToIndex]);

  function startAutoplay() {
    if (slides.length <= 1) return;
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(goNext, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    clearInterval(autoplayRef.current);
  }

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(autoplayRef.current);
  }, [goNext, slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <div
      className="relative w-full"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
    >
      <div
        ref={containerRef}
        className="carousel w-full rounded-none sm:rounded-lg overflow-hidden"
      >
        {slides.map((slide) => (
          <div key={slide.id} className="carousel-item relative w-full">
            <Link
              to={`/product/${slide.id}`}
              className="relative block w-full h-[260px] sm:h-[380px] md:h-[440px]"
            >
              <img
                src={slide.image}
                alt={slide.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 flex flex-col items-end gap-2 text-right">
                {slide.category && (
                  <span className="text-white/80 text-xs uppercase tracking-wide">
                    {slide.category}
                  </span>
                )}
                <h2 className="text-white text-xl sm:text-3xl font-bold max-w-xs sm:max-w-md">
                  {slide.name}
                </h2>
                <span className="text-white text-base sm:text-lg font-semibold">
                  {slide.price} ج.م
                </span>
                <span className="mt-2 inline-block bg-white text-gray-900 text-sm font-medium px-5 py-2 rounded-md hover:bg-gray-100 transition-colors">
                  تسوق الآن
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="السابق"
            className="btn btn-circle absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 border-none hover:bg-white text-gray-900"
          >
            ❮
          </button>
          <button
            onClick={goNext}
            aria-label="التالي"
            className="btn btn-circle absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 border-none hover:bg-white text-gray-900"
          >
            ❯
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                aria-label={`الشريحة ${index + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === activeIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HeroCarousel;