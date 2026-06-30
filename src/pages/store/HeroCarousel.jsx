import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const AUTOPLAY_INTERVAL = 4000;

function HeroCarousel({ slides }) {
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const autoplayRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index) => {
    const track = trackRef.current;
    const target = slideRefs.current[index];
    if (!track || !target) return;

    track.scrollTo({
      left: target.offsetLeft,
      behavior: "smooth",
    });
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
    stopAutoplay();
    autoplayRef.current = setInterval(goNext, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [goNext, slides.length]);

  function handleMouseDown(e) {
    const track = trackRef.current;
    if (!track) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.pageX;
    dragScrollLeftRef.current = track.scrollLeft;
    stopAutoplay();
  }

  function handleMouseMove(e) {
    if (!isDraggingRef.current) return;
    const track = trackRef.current;
    if (!track) return;

    const delta = e.pageX - dragStartXRef.current;
    if (Math.abs(delta) > 5) {
      hasDraggedRef.current = true;
    }
    track.scrollLeft = dragScrollLeftRef.current - delta;
  }

  function handleMouseUp() {
    isDraggingRef.current = false;
    startAutoplay();
  }

  function handleSlideClick(e) {
    if (hasDraggedRef.current) {
      e.preventDefault();
    }
  }

  if (!slides || slides.length === 0) return null;

  return (
    <div
      className="relative w-full"
      onMouseEnter={stopAutoplay}
      onMouseLeave={() => {
        if (!isDraggingRef.current) startAutoplay();
      }}
    >
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex overflow-x-auto no-scrollbar snap-x-mandatory cursor-grab active:cursor-grabbing select-none rounded-none sm:rounded-lg"
        style={{ scrollBehavior: "smooth" }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={(el) => (slideRefs.current[index] = el)}
            className="snap-start flex-shrink-0 w-full relative"
          >
            <Link
              to={`/product/${slide.id}`}
              onClick={handleSlideClick}
              draggable={false}
              className="relative block w-full h-[260px] sm:h-[380px] md:h-[440px]"
            >
              <img
                src={slide.image}
                alt={slide.name}
                draggable={false}
                className="w-full h-full object-cover pointer-events-none"
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
            className="btn btn-circle absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 border-none hover:bg-white text-gray-900 z-10"
          >
            ❮
          </button>
          <button
            onClick={goNext}
            aria-label="التالي"
            className="btn btn-circle absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 border-none hover:bg-white text-gray-900 z-10"
          >
            ❯
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
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