"use client";

import { Truck, CreditCard, Headphones } from "lucide-react";
import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";
import { useConfigTienda } from "@/app/hooks/config/useConfigTienda";
import { getEnvioGratisMensaje, getCuotasSinInteresMensaje } from "@/app/utils/promos-messages";

function getBenefits(config: ReturnType<typeof useConfigTienda>["data"]) {
  return [
    {
      icon: Truck,
      title: "Envíos gratis",
      description: `A todo el país. ${getEnvioGratisMensaje(config)}`,
    },
    {
      icon: CreditCard,
      title: "Financiación",
      description: getCuotasSinInteresMensaje(config),
    },
    {
      icon: Headphones,
      title: "Atención 24/7",
      description: "Soporte disponible todos los días",
    },
  ];
}

function BenefitItem({ benefit, index }: { benefit: ReturnType<typeof getBenefits>[0]; index: number }) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
    delay: index * 120,
  });

  const IconComponent = benefit.icon;

  return (
    <div
      ref={elementRef}
      className={`flex flex-col items-center justify-center gap-4 py-5 px-8 flex-1 transition-all duration-500 text-center ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <IconComponent className="w-5 h-5 text-principal shrink-0" strokeWidth={1.5} />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground tracking-wide">
          {benefit.title}
        </span>
        <span className="text-xs text-muted-foreground leading-relaxed">
          {benefit.description}
        </span>
      </div>
    </div>
  );
}

export default function BenefitsCards() {
  const { data: config } = useConfigTienda();
  const benefits = getBenefits(config);

  return (
    <section className="bg-background py-3 shadow-[0_4px_24px_0px_rgba(0,0,0,0.06)]">
      <div className="container mx-auto flex flex-col sm:flex-row items-center">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex flex-row items-center flex-1 w-full">
            <span className="hidden sm:block shrink-0 w-px h-6" style={{ background: "rgba(128,128,128,0.35)" }} />
            <BenefitItem benefit={benefit} index={index} />
            {index === benefits.length - 1 && (
              <span className="hidden sm:block shrink-0 w-px h-6" style={{ background: "rgba(128,128,128,0.35)" }} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
