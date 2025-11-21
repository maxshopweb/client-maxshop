"use client";

import Link from "next/link";
import ScrollAnimate from "../ui/ScrollAnimate";

const valueCards = [
  {
    image: "/value/value-1.jpg",
    title: "Herramientas Profesionales",
    description: "Equipamiento de alta calidad para profesionales de la construcción",
    link: "/tienda/productos?categoria=herramientas",
  },
  {
    image: "/value/value-2.jpg",
    title: "Soluciones Integrales",
    description: "Todo lo que necesitas para tus proyectos de construcción y renovación",
    link: "/tienda/productos?categoria=construccion",
  },
];

export default function ValueSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {valueCards.map((card, index) => (
            <ScrollAnimate
              key={index}
              direction={index % 2 === 0 ? "left" : "right"}
              delay={index * 150}
            >
              <div
                className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
              {/* Imagen */}
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Overlay con gradiente más sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-500" />
              </div>

              {/* Contenido */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10 text-white">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 md:mb-4 drop-shadow-2xl tracking-tight leading-tight">
                  {card.title}
                </h3>
                <p className="text-white/90 mb-5 md:mb-6 text-base sm:text-lg md:text-xl leading-relaxed font-normal max-w-2xl">
                  {card.description}
                </p>
                <Link
                  href={card.link}
                  className="group inline-flex items-center gap-3 text-principal hover:text-principal/80 font-medium text-lg md:text-xl transition-all duration-300 touch-manipulation"
                >
                  <span className="underline decoration-2 underline-offset-4 decoration-principal/60 group-hover:decoration-principal transition-all">
                    Ver Productos
                  </span>
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300 text-2xl">
                    →
                  </span>
                </Link>
              </div>
            </div>
            </ScrollAnimate>
          ))}
        </div>
      </div>
    </section>
  );
}

