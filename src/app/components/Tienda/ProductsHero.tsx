"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface ProductsHeroProps {
  title?: string;
  categoryName?: string;
}

export default function ProductsHero({ title, categoryName }: ProductsHeroProps) {
  return (
    <section className="relative border-b border-input overflow-hidden -z-10 min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/imgs/login.jpg')" }}
      />

      {/* Overlay oscuro para mejor legibilidad */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="container mx-auto px-4 py-20 md:py-32 lg:py-40 relative z-0 h-full flex items-center">
        <div className="flex flex-col items-start">
          {/* Breadcrumbs - Arriba de todo, alineado a la izquierda */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-sm text-white">
              <span className="text-white/80">Estás aquí:</span>
              <Link
                href="/"
                className="flex items-center gap-1 hover:text-principal transition-colors text-white"
              >
                <Home className="w-4 h-4" />
                <span>Inicio</span>
              </Link>
              <ChevronRight className="w-4 h-4 text-white/60" />
              <span className="text-white font-medium">
                {categoryName || "Productos"}
              </span>
            </div>
          </div>

          {/* Título Principal - Izquierda */}
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight drop-shadow-lg mb-4">
              {title}
            </h1>
            {/* Slogan llamativo */}
            <p className="text-xl md:text-2xl lg:text-3xl text-white/95 font-light drop-shadow-md max-w-2xl">
              Descubre productos únicos que transforman tu estilo de vida
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

