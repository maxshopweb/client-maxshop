"use client";

import Link from "next/link";
import { Truck, HelpCircle, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/context/ThemeProvider";
import { useCartSidebar } from "@/app/hooks/useCartSidebar";
import CartSidebar from "@/app/components/cart/CartSidebar";

const menuLinks = [
  { label: "Inicio", href: "/" },
  { label: "Tienda", href: "/tienda/productos" },
  // { label: "Categorías", href: "/categorias" },
  { label: "Ofertas", href: "/ofertas" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

export default function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { actualTheme } = useTheme();
  const { isOpen, close } = useCartSidebar();

  useEffect(() => {
    // Escuchar evento de scroll sincronizado desde TopHeader
    const handleNavbarScroll = (event: Event) => {
      const customEvent = event as CustomEvent;
      setIsScrolled(customEvent.detail.scrolled);
    };
    
    document.addEventListener('navbar-scroll', handleNavbarScroll);
    
    // También escuchar scroll directamente como fallback
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      document.removeEventListener('navbar-scroll', handleNavbarScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative z-50">
      <nav
        className={`transition-all duration-500 ${
          isScrolled 
            ? "shadow-md bg-white text-terciario" 
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12 md:h-14">
            {/* Main Menu Links - Desktop */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              {menuLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                
                return (
                  <Link
                    key={link.href}
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
                          ? isScrolled
                            ? "text-terciario font-medium"
                            : "text-white font-medium"
                          : isScrolled
                          ? "text-terciario/70 group-hover:text-terciario"
                          : "text-white/70 group-hover:text-white"
                      }`}
                    >
                      {link.label}
                    </span>
                    {/* Barrita debajo del link */}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-300 ease-out ${
                        isActive
                          ? isScrolled
                            ? "w-[50%] bg-terciario"
                            : "w-[50%] bg-white"
                          : isScrolled
                          ? "w-0 group-hover:w-[50%] bg-terciario/60"
                          : "w-0 group-hover:w-[50%] bg-white/60"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Utility Links - Desktop */}
            <div className="hidden lg:flex items-center gap-5">
              <div className={`flex items-center gap-2 text-sm transition-colors duration-300 group ${
                isScrolled
                  ? "text-terciario/90 hover:text-terciario" 
                  : "text-white/90 hover:text-white"
              }`}>
                <Truck size={18} className="transition-transform duration-300 group-hover:scale-110" />
                <span>Envío Gratis</span>
              </div>
              <Link
                href="/ayuda"
                className={`flex items-center gap-2 text-sm transition-colors duration-300 group ${
                  isScrolled
                    ? "text-terciario/90 hover:text-terciario" 
                    : "text-white/90 hover:text-white"
                }`}
              >
                <HelpCircle size={18} className="transition-transform duration-300 group-hover:scale-110" />
                <span>¿Necesitas Ayuda?</span>
              </Link>
            </div>

            {/* Mobile Menu Button - Right Side */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 hover:bg-white/10 rounded transition-all duration-300 active:scale-95 ml-auto ${
                isScrolled
                  ? "text-terciario"
                  : "text-white"
              }`}
              aria-label="Menú"
            >
              <div className="relative w-6 h-6">
                <Menu
                  size={24}
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                  }`}
                />
                <X
                  size={24}
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

      </nav>

      {/* Mobile Menu - Popup Dropdown */}
      <div
        className={`md:hidden absolute left-0 right-0 bg-principal shadow-2xl overflow-hidden transition-all duration-300 ease-out z-50 ${
          isMobileMenuOpen
            ? "max-h-[500px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
        }`}
        style={{ top: '100%' }}
      >
        {/* Menu Links */}
        <div className="px-4 py-5 space-y-2">
          {menuLinks.map((link, index) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group relative block text-base py-3 px-4 rounded-lg transition-all duration-300 ease-out ${
                  isActive ? '-translate-y-1' : 'group-hover:-translate-y-1'
                } ${
                  isActive
                    ? "text-terciario font-medium"
                    : "text-terciario/70 group-hover:text-terciario"
                } ${isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${index * 60}ms` : '0ms'
                }}
              >
                <span className="relative z-10 flex items-center">
                  {link.label}
                </span>
                {/* Barrita debajo del link */}
                <span
                  className={`absolute bottom-2 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-300 ease-out ${
                    isActive
                      ? "w-[50%] bg-terciario"
                      : "w-0 group-hover:w-[50%] bg-terciario/60"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-terciario/20 bg-terciario/5 space-y-3">
          <div className="flex items-center gap-3 text-sm text-terciario/70 px-3 py-2 rounded-lg hover:bg-terciario/10 transition-colors duration-200">
            <div className="p-1.5 bg-terciario/10 rounded-lg">
              <Truck size={16} className="text-terciario" />
            </div>
            <span className="font-medium">Envío Gratis</span>
          </div>
          <Link
            href="/ayuda"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 text-sm text-terciario/70 hover:text-terciario hover:bg-terciario/10 px-3 py-2 rounded-lg transition-all duration-200"
          >
            <div className="p-1.5 bg-terciario/10 rounded-lg">
              <HelpCircle size={16} className="text-terciario" />
            </div>
            <span className="font-medium">Ayuda</span>
          </Link>
        </div>
      </div>

      {/* Cart Sidebar - Posicionado justo debajo del NavigationBar */}
      <CartSidebar isOpen={isOpen} onClose={close} />
    </div>
  );
}
