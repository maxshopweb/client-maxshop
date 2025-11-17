"use client";

import Link from "next/link";
import { Truck, HelpCircle, Menu, X } from "lucide-react";
import { useState } from "react";

const menuLinks = [
  { label: "Inicio", href: "/" },
  { label: "Tienda", href: "/tienda/productos" },
  { label: "Categorías", href: "/categorias" },
  { label: "Ofertas", href: "/ofertas" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

export default function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-principal text-terciario">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12 md:h-14">
          {/* Main Menu Links - Desktop */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-bold text-sm lg:text-base hover:text-white transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Utility Links - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Truck size={18} />
              <span className="font-bold text-sm">Envío Gratis</span>
            </div>
            <Link
              href="/ayuda"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <HelpCircle size={18} />
              <span className="font-bold text-sm">¿Necesitas Ayuda?</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded transition-colors"
            aria-label="Menú"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4 space-y-3">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block font-bold text-base hover:text-white transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/20 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Truck size={18} />
                <span className="font-bold">Envío Gratis</span>
              </div>
              <Link
                href="/ayuda"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm"
              >
                <HelpCircle size={18} />
                <span className="font-bold">¿Necesitas Ayuda?</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
