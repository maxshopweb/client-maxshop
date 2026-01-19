"use client";

import { useEffect, useState } from "react";

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const checkActiveSection = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Obtener todas las secciones
      const aboutUsElement = document.getElementById("about-us");
      const contactoElement = document.getElementById("contacto");

      let newActiveSection = "";

      // Verificar si estamos en el top de la página
      if (scrollPosition < windowHeight * 0.3) {
        newActiveSection = "";
      } else if (contactoElement) {
        const contactoTop = contactoElement.offsetTop;
        const contactoBottom = contactoTop + contactoElement.offsetHeight;
        const viewportMiddle = scrollPosition + windowHeight * 0.3;

        if (viewportMiddle >= contactoTop && viewportMiddle < contactoBottom) {
          newActiveSection = "contacto";
        } else if (aboutUsElement) {
          const aboutUsTop = aboutUsElement.offsetTop;
          const aboutUsBottom = aboutUsTop + aboutUsElement.offsetHeight;

          if (viewportMiddle >= aboutUsTop && viewportMiddle < aboutUsBottom) {
            newActiveSection = "about-us";
          }
        }
      } else if (aboutUsElement) {
        const aboutUsTop = aboutUsElement.offsetTop;
        const aboutUsBottom = aboutUsTop + aboutUsElement.offsetHeight;
        const viewportMiddle = scrollPosition + windowHeight * 0.3;

        if (viewportMiddle >= aboutUsTop && viewportMiddle < aboutUsBottom) {
          newActiveSection = "about-us";
        }
      }

      setActiveSection(newActiveSection);
    };

    // Verificar al cargar
    checkActiveSection();

    // Verificar al hacer scroll
    window.addEventListener("scroll", checkActiveSection, { passive: true });
    
    // Verificar cuando cambia el hash (navegación por anclas)
    const handleHashChange = () => {
      setTimeout(checkActiveSection, 100);
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("scroll", checkActiveSection);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return activeSection;
}
