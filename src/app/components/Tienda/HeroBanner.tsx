"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBannersPublic } from "@/app/hooks/banners";
import { HeroBannerSlide } from "./HeroBannerSlide";
import { HeroBannerFallback } from "./HeroBannerFallback";

const AUTOPLAY_MS = 5000;

export default function HeroBanner() {
  const { data: banners = [], isLoading } = useBannersPublic("desktop");
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c === banners.length - 1 ? 0 : c + 1));
  }, [banners.length]);

  const prev = () => {
    setCurrent((c) => (c === 0 ? banners.length - 1 : c - 1));
  };

  // Autoplay solo si hay más de un banner
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  // Reset índice si cambia la cantidad de banners
  useEffect(() => {
    setCurrent(0);
  }, [banners.length]);

  if (isLoading) {
    return (
      <div className="w-full h-[320px] sm:h-[420px] md:h-[520px] animate-pulse bg-secundario/50" />
    );
  }

  const hasBanners = banners.length > 0;

  return (
    <section className="relative bg-linear-to-r from-secundario via-terciario to-secundario text-white overflow-hidden">
      {/* Fondo de patrón (siempre visible) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/G%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Contenido */}
      {hasBanners ? (
        <>
          {/* Slide activo */}
          <HeroBannerSlide banner={banners[current]} priority={current === 0} />

          {/* Controles: solo con más de un banner */}
          {banners.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Banner anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors backdrop-blur-sm"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={next}
                aria-label="Banner siguiente"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors backdrop-blur-sm"
              >
                <ChevronRight size={24} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Ir al banner ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current
                        ? "bg-white w-6"
                        : "bg-white/40 w-2 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <HeroBannerFallback />
      )}

      {/* Ola inferior */}
      {/* <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="var(--background)"
          />
        </svg>
      </div> */}
    </section>
  );
}
