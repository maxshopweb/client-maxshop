"use client";

import { Wrench, Building2, ArrowRight } from "lucide-react";
import ScrollAnimate from "../ui/ScrollAnimate";
import HeroButton from "../ui/HeroButton";

const valueCards = [
  {
    image: "/value/value-1.jpg",
    title: "Herramientas profesionales",
    description: "Equipamiento de alta calidad para profesionales de la construcción",
    link: "/tienda/productos?categoria=herramientas",
    icon: Wrench,
  },
  {
    image: "/value/value-2.jpg",
    title: "Soluciones integrales",
    description: "Todo lo que necesitas para tus proyectos de construcción y renovación",
    link: "/tienda/productos?categoria=construccion",
    icon: Building2,
  },
];

export default function ValueSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {valueCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <ScrollAnimate
                key={index}
                direction={index % 2 === 0 ? "left" : "right"}
                delay={index * 150}
              >
                <div
                  className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
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
                    {/* Icono decorativo */}
                    <div className="mb-4 md:mb-5">
                      <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-principal/20 backdrop-blur-sm border border-principal/30">
                        <Icon className="w-6 h-6 md:w-7 md:h-7 text-principal" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 md:mb-4 drop-shadow-2xl tracking-tight leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-white/90 mb-6 md:mb-8 text-base sm:text-lg md:text-xl leading-relaxed font-normal max-w-2xl">
                      {card.description}
                    </p>
                    
                    {/* Botón HeroButton */}
                    <HeroButton
                      variant="orange-white"
                      icon={ArrowRight}
                      href={card.link}
                      className="mt-auto"
                    >
                      Ver Productos
                    </HeroButton>
                  </div>
                </div>
              </ScrollAnimate>
            );
          })}
        </div>
      </div>
    </section>
  );
}

