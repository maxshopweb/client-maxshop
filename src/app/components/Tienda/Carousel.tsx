"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import HeroButton from "@/app/components/ui/HeroButton";

const carouselImages = [
  "/carrousel/black-decker-1.jpg",
  "/carrousel/dewalt-1.jpg",
  "/carrousel/ignco-1.jpg",
  "/carrousel/stanley-1.jpg",
];

export default function Carousel() {
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
    <div className="relative w-full h-full min-h-[500px] overflow-hidden bg-secundario group z-0">
      {/* Carousel Images */}
      <div className="relative w-full h-full">
        {carouselImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Gradient Overlays for better visibility of controls */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/50 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />
      
      {/* Overlay oscuro para mejor legibilidad del texto centrado */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 pointer-events-none" />
      
      {/* Hero Text Overlay - Centrado */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 mt-15">
        <div className="text-center w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-5 lg:mb-6 drop-shadow-2xl tracking-tight leading-tight">
            Tus herramientas
            <br />
            al mejor precio
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white mb-4 sm:mb-5 md:mb-6 lg:mb-8 drop-shadow-2xl max-w-4xl mx-auto px-2">
            Calidad garantizada, envío rápido y atención personalizada
          </p>
          {/* Call to Action */}
          <div className="pointer-events-auto flex justify-center">
            <HeroButton
              variant="white-orange"
              icon={ArrowRight}
              href="/tienda/productos"
            >
              Ver Catálogo
            </HeroButton>
          </div>
        </div>
      </div>

      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/40 backdrop-blur-sm p-2 md:p-3 rounded-full transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 touch-manipulation"
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/40 backdrop-blur-sm p-2 md:p-3 rounded-full transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 touch-manipulation"
        aria-label="Siguiente imagen"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </button>

      {/* Indicators (dots) */}
      <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 touch-manipulation ${
              index === currentIndex
                ? "w-6 md:w-8 h-1.5 md:h-2 bg-principal"
                : "w-1.5 md:w-2 h-1.5 md:h-2 bg-white/50 hover:bg-white/80"
            } rounded-full`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-black/50 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full text-white text-xs md:text-sm font-semibold">
        {currentIndex + 1} / {carouselImages.length}
      </div>
    </div>
  );
}

