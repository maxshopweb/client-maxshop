"use client";

import { useEffect, useState } from "react";

const SECTIONS = ["about-us", "contacto"];

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    // Mapa de secciones visibles con su ratio de intersección
    const visibilityMap = new Map<string, number>();

    const pickActive = () => {
      // Ordenar por ratio descendente y tomar la más visible
      let best = "";
      let bestRatio = 0;
      visibilityMap.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = id;
        }
      });
      setActiveSection(best);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap.set(entry.target.id, entry.intersectionRatio);
        });
        pickActive();
      },
      {
        // Disparar en múltiples umbrales para mayor precisión
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        // El rootMargin recorta el área de detección: la sección debe ocupar
        // al menos la zona central del viewport para considerarse activa
        rootMargin: "-40% 0px -40% 0px",
      }
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return activeSection;
}
