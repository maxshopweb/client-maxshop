"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselImages = [
  "/carrousel/black-decker-1.jpg",
  "/carrousel/dewalt-1.jpg",
  "/carrousel/ignco-1.jpg",
  "/carrousel/stanley-1.jpg",
];

export default function SmallCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play: cambiar imagen cada 3.5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="py-6 md:py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative w-full max-w-4xl mx-auto h-[180px] sm:h-[220px] md:h-[250px] overflow-hidden bg-secundario rounded-xl group">
          {/* Carousel Images */}
          <div className="relative w-full h-full">
            {carouselImages.map((image, index) => (
              <div
                key={image}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Gradient Overlays */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/50 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />

          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/40 backdrop-blur-sm p-1.5 md:p-2 rounded-full transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 touch-manipulation"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/40 backdrop-blur-sm p-1.5 md:p-2 rounded-full transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 touch-manipulation"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 touch-manipulation ${
                  index === currentIndex
                    ? "w-5 md:w-6 h-1 md:h-1.5 bg-principal"
                    : "w-1 md:w-1.5 h-1 md:h-1.5 bg-white/50 hover:bg-white/80"
                } rounded-full`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

