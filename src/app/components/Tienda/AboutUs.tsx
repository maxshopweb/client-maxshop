"use client";

import { Wrench, ShieldCheck, Headphones, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import HeroButton from "../ui/HeroButton";
import Image from "next/image";

const featureItems = [
  {
    icon: Wrench,
    title: "Equipamiento profesional",
    description: "Herramientas y materiales de nivel profesional para cada etapa de tu obra.",
  },
  {
    icon: ShieldCheck,
    title: "Calidad garantizada",
    description: "Cada producto pasa por un control de calidad antes de llegar a tus manos.",
  },
  {
    icon: Headphones,
    title: "Asesoramiento experto",
    description: "Nuestro equipo te guía para elegir la solución correcta para tu proyecto.",
  },
];

export default function AboutUs() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden" id="about-us">
      {/* Foto full-width de fondo */}
      <Image
        src="/imgs/about.jpg"
        alt="MaxShop — quiénes somos"
        className="absolute inset-0 w-full h-full object-cover object-center"
        width={1000}
        height={1000}
      />

      {/* Overlay negro */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Contenido — alineado a la derecha */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="ml-auto w-full max-w-lg">

          {/* Badge */}
          <div
            className={`transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="inline-flex items-center border border-white/20 text-white/60 text-xs font-medium px-3 py-1 rounded-md mb-8 tracking-widest uppercase">
              Quiénes somos
            </span>
          </div>

          {/* Título */}
          <div
            className={`transition-all duration-700 ease-out delay-150 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-10">
              Trabajamos<br />
              <span className="text-principal">para vos.</span>
            </h2>
          </div>

          {/* Feature items */}
          <div className="space-y-6 mb-10">
            {featureItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-4 transition-all duration-700 ease-out ${
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: mounted ? `${300 + i * 100}ms` : "0ms" }}
                >
                  <div className="w-9 h-9 rounded-md bg-white/8 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-white/60" />
                  </div>
                  <div>
                    <p className="font-medium text-white/90 text-sm leading-snug mb-0.5">
                      {item.title}
                    </p>
                    <p className="text-white/40 text-sm leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botón */}
          <div
            className={`transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: mounted ? "650ms" : "0ms" }}
          >
            {/* <HeroButton variant="orange-white" icon={ArrowRight} href="/tienda">
              Ver productos
            </HeroButton> */}
          </div>

        </div>
      </div>
    </section>
  );
}
