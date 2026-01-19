"use client";

import Link from "next/link";
import type { MenuLink } from "../navbar.types";
import { useActiveSection } from "../hooks/useActiveSection";

interface MobileMenuLinksProps {
  links: MenuLink[];
  pathname: string;
  isOpen: boolean;
  onLinkClick: () => void;
}

export default function MobileMenuLinks({
  links,
  pathname,
  isOpen,
  onLinkClick,
}: MobileMenuLinksProps) {
  const activeSection = useActiveSection();

  return (
    <div className="p-4 space-y-2">
      {links.map((link, index) => {
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
            onClick={onLinkClick}
            className={`block py-4 px-4 rounded-lg transition-all duration-300 ${
              isActive
                ? "bg-white/20 text-white font-medium"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
            style={{
              animationDelay: isOpen ? `${index * 50}ms` : '0ms'
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

