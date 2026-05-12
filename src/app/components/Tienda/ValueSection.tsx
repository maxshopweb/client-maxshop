"use client";

import { Building2, ArrowRight, Users } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useRef, useEffect, useState } from "react";
import HeroButton from "../ui/HeroButton";
import { useWhatsapp } from "@/app/hooks/contact/useWhatsapp";

function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return { ref, visible };
}

const valueRows = [
  // {
  //   image: "/value/value-1.jpg",
  //   badge: "Herramientas",
  //   title: "Equipamiento para\nprofesionales",
  //   description:
  //     "La mayor variedad en herramientas eléctricas, de mano y accesorios. Calidad de marca, al alcance de tu presupuesto.",
  //   cta: { label: "Ver productos", href: "/tienda/productos?categoria=herramientas", icon: ArrowRight, variant: "orange-white" as const },
  //   icon: Wrench,
  //   imageLeft: false,
  // },
  {
    image: "/value/value-2.jpg",
    badge: "Construcción",
    title: "Todo para tu\npróximo proyecto",
    description:
      "Materiales y soluciones integrales de construcción y renovación. Hablá con un asesor y encontrá lo que necesitás.",
    cta: { label: "Hablar con un asesor", whatsapp: true, icon: FaWhatsapp, variant: "ghost-orange" as const },
    icon: Building2,
    imageLeft: true,
  },
  {
    image: "/imgs/maxshop.jpg",
    badge: "Quiénes somos",
    /** Ancla compartida con MENU_LINKS «Nosotros» (`/#about-us`) y useActiveSection */
    sectionId: "about-us",
    title: "Trabajamos\npara vos.",
    description:
      "Equipamiento profesional y materiales de calidad para cada etapa de tu obra. Cada producto pasa por control antes de llegar a tus manos, y nuestro equipo te guía para elegir la solución adecuada a tu proyecto.",
    cta: {
      label: "Ver productos",
      href: "/tienda/productos",
      icon: ArrowRight,
      variant: "orange-white" as const,
    },
    icon: Users,
    imageLeft: false,
  },
];

function ValueRow({ row }: { row: (typeof valueRows)[number] }) {
  const { ref: imgRef, visible: imgVisible } = useFadeIn(0);
  const { ref: textRef, visible: textVisible } = useFadeIn(180);
  const whatsapp = useWhatsapp();
  const Icon = row.icon;
  const CtaIcon = row.cta.icon;
  const ctaIsWhatsapp = "whatsapp" in row.cta && row.cta.whatsapp;
  const ctaHref = ctaIsWhatsapp ? whatsapp.buildUrl() : "href" in row.cta ? row.cta.href : "#";

  return (
    <div
      id={"sectionId" in row && row.sectionId ? row.sectionId : undefined}
      className={`relative flex flex-col lg:flex-1 lg:min-h-0 overflow-hidden scroll-mt-[140px] ${
        row.imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
      }`}
    >
      {/* Imagen */}
      <div
        ref={imgRef}
        className="relative w-full lg:w-1/2 h-[60vw] min-h-[260px] lg:h-full shrink-0"
        style={{
          opacity: imgVisible ? 1 : 0,
          transform: imgVisible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
          willChange: "opacity, transform",
        }}
      >
        <img
          src={row.image}
          alt={row.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Texto */}
      <div
        ref={textRef}
        className="relative w-full lg:w-1/2 shrink-0 flex items-center border-y border-card lg:border lg:border-card bg-background"
        style={{
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
          willChange: "opacity, transform",
        }}
      >
        <div className={`flex flex-col justify-center w-full px-8 md:px-12 lg:px-16 py-12 lg:py-0 ${!row.imageLeft ? "lg:items-end lg:text-right" : ""}`}>

          {/* Badge gloss */}
          <span
            className="inline-flex items-center gap-1.5 w-fit mb-6 px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide"
            style={{
              background: "linear-gradient(135deg, rgba(232,138,66,0.18) 0%, rgba(255,255,255,0.28) 50%, rgba(232,138,66,0.12) 100%)",
              border: "1px solid rgba(232,138,66,0.35)",
              color: "var(--principal)",
              backdropFilter: "blur(8px)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 3px rgba(232,138,66,0.15)",
            }}
          >
            <Icon className="w-3 h-3" />
            {row.badge}
          </span>

          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-5 whitespace-pre-line">
            {row.title}
          </h3>
          <p className="text-sm md:text-base text-foreground/60 leading-relaxed mb-8 max-w-2xl">
            {row.description}
          </p>
          <HeroButton
            variant={row.cta.variant}
            icon={CtaIcon}
            href={ctaHref}
            target={ctaIsWhatsapp ? "_blank" : undefined}
            rel={ctaIsWhatsapp ? "noopener noreferrer" : undefined}
          >
            {row.cta.label}
          </HeroButton>
        </div>
      </div>
    </div>
  );
}

export default function ValueSection() {
  return (
    <section className="bg-background overflow-x-hidden lg:h-screen lg:flex lg:flex-col lg:overflow-hidden">
      {valueRows.map((row, index) => (
        <ValueRow key={index} row={row} />
      ))}
    </section>
  );
}
