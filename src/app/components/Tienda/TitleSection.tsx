"use client";

import { Download } from "lucide-react";

export default function TitleSection() {
  const handleDownloadCatalog = () => {
    // Por ahora no hace nada
  };

  return (
    <section className="bg-gradient-to-b from-background to-background/50 py-8 md:py-12">
      <div className="container mx-auto px-4 text-center">
        {/* Título Principal */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-principal mb-3 md:mb-4 tracking-tight drop-shadow-lg">
          MAX SHOP
        </h1>
        
        {/* Subtítulos */}
        <div className="space-y-1 md:space-y-2 mb-6 md:mb-10">
          <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-text tracking-wide">
            Herramientas profesionales
          </p>
          <p className="text-base sm:text-lg md:text-xl text-text/80 font-medium px-2">
            Soluciones integrales para construcción y ferretería
          </p>
        </div>

        {/* Botón Descargar Catálogo */}
        <button
          onClick={handleDownloadCatalog}
          className="group relative inline-flex items-center gap-2 md:gap-3 bg-principal hover:bg-principal/90 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden touch-manipulation"
        >
          {/* Efecto de brillo */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <Download size={24} className="relative z-10" />
          <span className="relative z-10">DESCARGAR CATÁLOGO</span>
        </button>

        {/* Línea decorativa */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-px w-24 bg-principal/30" />
          <div className="w-2 h-2 rounded-full bg-principal" />
          <div className="h-px w-24 bg-principal/30" />
        </div>
      </div>
    </section>
  );
}

