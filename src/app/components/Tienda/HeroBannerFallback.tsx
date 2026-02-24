import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Contenido estático de fallback cuando no hay banners configurados. */
export function HeroBannerFallback() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
      <div className="flex items-center justify-between">
        {/* Texto */}
        <div className="max-w-xl space-y-4 md:space-y-6">
          <div className="inline-block bg-principal text-terciario px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm">
            ¡OFERTA ESPECIAL!
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Las Mejores
            <br />
            <span className="text-principal">Herramientas</span>
            <br />
            del Mercado
          </h1>

          <div className="space-y-2">
            <p className="text-2xl md:text-3xl font-bold text-principal">
              Descuento hasta 40% OFF
            </p>
            <p className="text-base md:text-lg text-white/80">
              En productos seleccionados de todas las categorías
            </p>
            <p className="text-xs md:text-sm text-white/60">
              Mantente atento a la fecha de la promoción
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
            <Link
              href="/tienda/productos"
              className="bg-principal hover:bg-principal/90 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg text-sm md:text-base"
            >
              Comprar Ahora
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/ofertas"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold transition-all border border-white/20 text-center text-sm md:text-base"
            >
              Ver Ofertas
            </Link>
          </div>
        </div>

        {/* Ilustración decorativa */}
        <div className="hidden lg:block">
          <div className="relative w-96 h-96">
            <div className="absolute inset-0 bg-principal/20 rounded-full blur-3xl" />
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-8xl">🛠️</div>
                <p className="text-principal font-bold text-lg">Calidad Profesional</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
