"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-r from-secundario via-terciario to-secundario text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="flex items-center justify-between">
          {/* Text Content */}
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

          {/* Image/Illustration Area */}
          <div className="hidden lg:block">
            <div className="relative w-96 h-96">
              {/* Decorative Circle */}
              <div className="absolute inset-0 bg-principal/20 rounded-full blur-3xl"></div>
              
              {/* Placeholder for product image or illustration */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-8xl">🛠️</div>
                  <p className="text-principal font-bold text-lg">
                    Calidad Profesional
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="var(--background)"
          />
        </svg>
      </div>
    </section>
  );
}

