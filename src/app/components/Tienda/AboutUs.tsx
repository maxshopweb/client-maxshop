"use client";

import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";
import { Building2, Users, Award } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: Building2,
    title: "Desde 1989",
    description: "Más de 30 años de experiencia en el mercado",
  },
  {
    icon: Users,
    title: "Equipo experto",
    description: "Profesionales dedicados a tu servicio",
  },
  {
    icon: Award,
    title: "Calidad garantizada",
    description: "Productos y servicios de primera calidad",
  },
];

export default function AboutUs() {
  const { elementRef: imageRef, isVisible: imageVisible } = useScrollAnimation({
    threshold: 0.2,
    triggerOnce: true,
  });

  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation({
    threshold: 0.2,
    triggerOnce: true,
    delay: 100,
  });

  const { elementRef: textRef, isVisible: textVisible } = useScrollAnimation({
    threshold: 0.2,
    triggerOnce: true,
    delay: 200,
  });

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Contenedor principal: Imagen izquierda, Contenido derecha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 mb-12 md:mb-16">
          {/* Imagen a la izquierda */}
          <div
            ref={imageRef}
            className={`relative h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl transition-all duration-700 ease-out ${
              imageVisible
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 -translate-x-8 scale-95"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-principal/20 to-secundario/20 z-10"></div>
            <Image
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80"
              alt="Sobre Nosotros"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay decorativo */}
            <div className="absolute top-4 right-4 w-24 h-24 bg-principal/10 rounded-full blur-2xl z-0"></div>
            <div className="absolute bottom-4 left-4 w-32 h-32 bg-secundario/10 rounded-full blur-3xl z-0"></div>
          </div>

          {/* Contenido a la derecha */}
          <div className="flex flex-col justify-center">
            <div
              ref={titleRef}
              className={`mb-6 transition-all duration-700 ease-out ${
                titleVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <span className="text-sm md:text-base text-principal font-semibold uppercase tracking-wider mb-3 block">
                Quiénes Somos
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
                Trabajamos para vos{" "}
                <span className="text-principal">desde 1989</span>
              </h2>
              <div className="h-1 w-16 bg-principal rounded-full mt-4"></div>
            </div>

            <p
              ref={textRef}
              className={`text-base md:text-lg text-foreground/80 leading-relaxed mb-6 transition-all duration-700 ease-out ${
                textVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
            >
              Industrial alrededor del mundo. Durante la Revolución Industrial, la
              manufactura emergió como un motor principal de trabajo y producción
              en naciones europeas y norteamericanas.
            </p>

            {/* Lista de beneficios */}
            <div className="space-y-3">
              {[
                "24/7 Servicio de Llamadas Disponible",
                "Grandes Consultores Especializados",
                "Miembros del Equipo Expertos",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-foreground/80"
                >
                  <div className="w-5 h-5 rounded-full bg-principal/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-principal"></div>
                  </div>
                  <span className="text-sm md:text-base">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Cards abajo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: typeof features[0];
  index: number;
}) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
    delay: 400 + index * 100,
  });

  const IconComponent = feature.icon;

  return (
    <div
      ref={elementRef}
      className={`bg-card border border-card rounded-xl p-6 md:p-8 text-center transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-2 group ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
    >
      <div className="bg-principal/10 rounded-full w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 flex items-center justify-center transition-all duration-300 group-hover:bg-principal/20 group-hover:scale-110">
        <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-principal transition-transform duration-300 group-hover:scale-110" />
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
        {feature.title}
      </h3>
      <p className="text-sm md:text-base text-foreground/70">
        {feature.description}
      </p>
    </div>
  );
}

