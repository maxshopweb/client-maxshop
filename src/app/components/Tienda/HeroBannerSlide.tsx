import Image from "next/image";
import Link from "next/link";
import type { IBannerPublic } from "@/app/types/banner.type";

interface HeroBannerSlideProps {
  banner: IBannerPublic;
  priority?: boolean;
}

/**
 * Render puro de un banner individual.
 * La altura la define la imagen (width 100% + height auto).
 * Los degradados van SOBRE la foto en los costados.
 */
export function HeroBannerSlide({ banner, priority = false }: HeroBannerSlideProps) {
  const content = (
    <div className="relative w-full h-[450px] sm:h-[450px] md:h-[500px] overflow-hidden">
      <Image
        src={banner.url!}
        alt={`Banner ${banner.orden}`}
        fill
        className="object-cover"
        priority={priority}
        sizes="100vw"
      />

      {/* Degradado izquierda SOBRE la foto */}
      <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-linear-to-r from-secundario/90 via-secundario/40 to-transparent pointer-events-none" />

      {/* Degradado derecha SOBRE la foto */}
      <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-linear-to-l from-secundario/90 via-secundario/40 to-transparent pointer-events-none" />
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
