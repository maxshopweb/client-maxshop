"use client";

import { useState, useEffect, useCallback, useMemo, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBannersPublic } from "@/app/hooks/banners";
import { HeroBannerSlide } from "./HeroBannerSlide";
import { HeroBannerFallback } from "./HeroBannerFallback";

const AUTOPLAY_MS = 5000;

function subscribeMobileViewport(cb: () => void) {
  const mq = window.matchMedia("(max-width: 767px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getMobileViewportSnapshot() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function getServerMobileViewportSnapshot() {
  return false;
}

function useIsMobileViewport() {
  return useSyncExternalStore(
    subscribeMobileViewport,
    getMobileViewportSnapshot,
    getServerMobileViewportSnapshot
  );
}

export default function HeroBanner() {
  const isMobileViewport = useIsMobileViewport();
  const { data: mobileBanners = [], isLoading: loadingMobile } = useBannersPublic("mobile");
  const { data: desktopBanners = [], isLoading: loadingDesktop } = useBannersPublic("desktop");

  const banners =
    isMobileViewport && mobileBanners.length > 0 ? mobileBanners : desktopBanners;

  const isLoading = useMemo(() => {
    if (!isMobileViewport) return loadingDesktop;
    if (loadingMobile) return true;
    if (mobileBanners.length > 0) return false;
    return loadingDesktop;
  }, [isMobileViewport, mobileBanners.length, loadingMobile, loadingDesktop]);

  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c === banners.length - 1 ? 0 : c + 1));
  }, [banners.length]);

  const prev = () => {
    setCurrent((c) => (c === 0 ? banners.length - 1 : c - 1));
  };

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  useEffect(() => {
    setCurrent(0);
  }, [banners.length]);

  if (isLoading) {
    return (
      <div className="w-full aspect-1920/600 animate-pulse bg-secundario/50" />
    );
  }

  const hasBanners = banners.length > 0;

  return (
    <section className="relative bg-linear-to-r from-secundario via-terciario to-secundario text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/G%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {hasBanners ? (
        <>
          <HeroBannerSlide
            key={banners[current].id}
            banner={banners[current]}
            priority={current === 0}
          />

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
    </section>
  );
}
