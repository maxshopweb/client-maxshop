"use client";

import { Truck, CreditCard, Headphones } from "lucide-react";
import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";

const benefits = [
  {
    icon: Truck,
    title: "Envíos gratis",
    description: "A todo el país en compras superiores a $50.000",
  },
  {
    icon: CreditCard,
    title: "Financiación",
    description: "Hasta 12 cuotas sin interés",
  },
  {
    icon: Headphones,
    title: "Atención 24/7",
    description: "Soporte disponible todos los días",
  },
];

function BenefitCard({ benefit, index }: { benefit: typeof benefits[0]; index: number }) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
    delay: index * 100,
  });

  const IconComponent = benefit.icon;

  return (
    <div
      ref={elementRef}
      className={`bg-card rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 p-4 md:p-5 flex flex-row items-center gap-3 md:gap-4 ${
        isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-4"
      }`}
    >
      {/* Icono con fondo naranja */}
      <div className="bg-principal rounded-full p-2.5 md:p-3 flex-shrink-0">
        <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </div>
      
      {/* Contenido de texto */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Título */}
        <h3 className="text-sm md:text-base font-semibold text-foreground mb-0.5 md:mb-1">
          {benefit.title}
        </h3>
        
        {/* Descripción */}
        <p className="text-xs md:text-sm text-muted-foreground leading-tight">
          {benefit.description}
        </p>
      </div>
    </div>
  );
}

export default function BenefitsCards() {
  return (
    <section className="py-4 md:py-6 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

