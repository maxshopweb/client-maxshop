"use client";

import Link from "next/link";
import type { MenuLink } from "../navbar.types";
import { useActiveSection } from "../hooks/useActiveSection";

interface NavbarDesktopMenuProps {
  links: MenuLink[];
  pathname: string;
  shouldShowBackground: boolean;
  actualTheme: "light" | "dark";
}

export default function NavbarDesktopMenu({
  links,
  pathname,
  shouldShowBackground,
  actualTheme,
}: NavbarDesktopMenuProps) {
  const activeSection = useActiveSection();

  return (
    <div className="flex items-center gap-4 lg:gap-6">
      {links.map((link) => {
        // Detectar si el link es activo
        let isActive = false;
        
        if (pathname === "/") {
          // En la página principal, verificar secciones
          if (link.href === "/") {
            // Inicio está activo solo si no hay sección activa (estamos en el top)
            isActive = activeSection === "";
          } else if (link.href === "/#about-us") {
            isActive = activeSection === "about-us";
          } else if (link.href === "/#contacto") {
            isActive = activeSection === "contacto";
          } else {
            // Para otros links, usar lógica normal
            isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          }
        } else {
          // Para otras páginas, usar lógica normal
          isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        }

        return (
          <Link
            key={link.label}
            href={link.href}
            className={`relative text-sm lg:text-base group py-2 px-2 -mx-2 rounded-md transition-all duration-300 ease-out ${
              isActive ? '-translate-y-1' : 'group-hover:-translate-y-1'
            }`}
          >
            <span
              className={`relative z-10 inline-block transition-all duration-300 ease-out ${
                isActive ? '-translate-y-1' : 'group-hover:-translate-y-1'
              } ${
                isActive
                  ? shouldShowBackground
                    ? actualTheme === 'dark'
                      ? "text-white font-medium"
                      : "text-terciario font-medium"
                    : "text-white font-medium"
                  : shouldShowBackground
                  ? actualTheme === 'dark'
                    ? "text-white/70 group-hover:text-white"
                    : "text-terciario/70 group-hover:text-terciario"
                  : "text-white/70 group-hover:text-white"
              }`}
            >
              {link.label}
            </span>
            {/* Barrita debajo del link */}
            <span
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-300 ease-out ${
                isActive
                  ? shouldShowBackground
                    ? actualTheme === 'dark'
                      ? "w-[50%] bg-principal"
                      : "w-[50%] bg-terciario"
                    : "w-[50%] bg-white"
                  : shouldShowBackground
                  ? actualTheme === 'dark'
                    ? "w-0 group-hover:w-[50%] bg-principal"
                    : "w-0 group-hover:w-[50%] bg-secundario"
                  : "w-0 group-hover:w-[50%] bg-white/60"
              }`}
            />
          </Link>
        );
      })}
    </div>
  );
}

