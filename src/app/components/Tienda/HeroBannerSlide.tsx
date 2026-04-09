"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { IBannerPublic } from "@/app/types/banner.type";

/** Ratio inicial hasta onLoadingComplete (solo evita CLS antes de leer píxeles reales). */
const DEFAULT_ASPECT = "1920 / 600";

interface HeroBannerSlideProps {
  banner: IBannerPublic;
  priority?: boolean;
}

/**
 * Ancho 100%; el alto lo define únicamente la proporción de la imagen (sin min-height extra).
 */
export function HeroBannerSlide({ banner, priority = false }: HeroBannerSlideProps) {
  const [aspectRatio, setAspectRatio] = useState(DEFAULT_ASPECT);

  const content = (
    <div
      className="relative w-full overflow-hidden bg-secundario"
      style={{ aspectRatio: aspectRatio }}
    >
      <Image
        src={banner.url!}
        alt={`Banner ${banner.orden}`}
        fill
        className="object-contain object-center"
        priority={priority}
        sizes="100vw"
        onLoadingComplete={(img) => {
          const { naturalWidth, naturalHeight } = img;
          if (naturalWidth > 0 && naturalHeight > 0) {
            setAspectRatio(`${naturalWidth} / ${naturalHeight}`);
          }
        }}
      />

      <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-linear-to-r from-secundario/90 via-secundario/40 to-transparent pointer-events-none z-10" />

      <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-linear-to-l from-secundario/90 via-secundario/40 to-transparent pointer-events-none z-10" />
    </div>
  );

  if (banner.link) {
    return (
      <Link href={banner.link} className="block w-full">
        {content}
      </Link>
    );
  }

  return content;
}
