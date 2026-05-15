"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MenuLink } from "../navbar.types";
import { useActiveSection } from "../hooks/useActiveSection";
import { parseHomeSectionHashId, scrollToHashSectionWhenReady } from "../utils/hashSectionScroll";

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
  const router = useRouter();
  const activeSection = useActiveSection();

  const handleHashLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const id = parseHomeSectionHashId(href);
    if (!id || pathname !== "/") return;
    e.preventDefault();
    router.replace(`/#${id}`, { scroll: false });
    scrollToHashSectionWhenReady(id);
  };

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
            onClick={(e) => handleHashLinkClick(e, link.href)}
            className="relative group py-2 px-1 flex flex-col items-center gap-0"
          >
            <span
              className={`text-sm lg:text-base tracking-wide transition-colors duration-200 ${
                isActive
                  ? shouldShowBackground
                    ? "text-foreground font-medium"
                    : "text-white font-medium"
                  : shouldShowBackground
                    ? "text-foreground/50 group-hover:text-foreground"
                    : "text-white/60 group-hover:text-white"
              }`}
            >
              {link.label}
            </span>
            <span
              className={`block h-px transition-all duration-300 ${
                shouldShowBackground ? "bg-principal" : "bg-white"
              } ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
            />
          </Link>
        );
      })}
    </div>
  );
}

