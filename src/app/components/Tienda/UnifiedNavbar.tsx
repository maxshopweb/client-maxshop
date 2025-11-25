"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShoppingCart, Sun, Moon, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/app/context/ThemeProvider";
import { useAuth } from "@/app/context/AuthContext";
import { useCartStore } from "@/app/stores/cartStore";
import { useCartSidebar } from "@/app/hooks/useCartSidebar";
import CartSidebar from "@/app/components/cart/CartSidebar";

const menuLinks = [
  { label: "Inicio", href: "/" },
  { label: "Tienda", href: "/tienda/productos" },
  { label: "Nosotros", href: "#contacto" },
  { label: "Contacto", href: "#contacto" },
];

export default function UnifiedNavbar() {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { actualTheme, setTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { summary } = useCartStore();
  const { isOpen, open, close } = useCartSidebar();

  // Construir la URL de login con el redirect
  const getLoginUrl = () => {
    if (pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/forgot-password')) {
      return '/login';
    }
    return `/login?redirect=${encodeURIComponent(pathname || '/')}`;
  };

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  // Cerrar mobile menu al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Determinar si debe mostrar background siempre (páginas que no sean home)
  const isHomePage = pathname === '/';
  const shouldShowBackground = !isHomePage || isScrolled;

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* Parte Superior: Logo, Toggle, User, Cart */}
        <div
          className={`transition-all duration-500 ${
            shouldShowBackground
              ? "py-2 shadow-lg bg-principal text-white"
              : "py-4 bg-principal text-white"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="relative flex items-center justify-between">
              {/* Toggle Dark Mode - Izquierda */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => setTheme(actualTheme === 'dark' ? 'light' : 'dark')}
                  className="p-2 hover:bg-white/10 transition-all duration-300 rounded-lg"
                  aria-label="Cambiar tema"
                >
                  {actualTheme === 'dark' ? (
                    <Sun size={22} className="text-white transition-transform duration-300 hover:scale-110" />
                  ) : (
                    <Moon size={22} className="text-white transition-transform duration-300 hover:scale-110" />
                  )}
                </button>
              </div>

              {/* Logo - Centro Absoluto */}
              <Link
                href="/"
                className="absolute left-1/2 transform -translate-x-1/2 group"
              >
                <Image
                  src="/logos/logo-positivo.svg"
                  alt="MaxShop"
                  width={120}
                  height={40}
                  className="h-8 md:h-10 w-auto transition-transform duration-300 group-hover:scale-105 brightness-0 invert"
                />
              </Link>

              {/* User & Cart - Derecha */}
              <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 ml-auto">
                {/* User Account */}
                {isAuthenticated && user ? (
                  <div ref={userMenuRef} className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="relative p-2 hover:bg-white/10 transition-all duration-300 rounded-lg"
                      aria-label="Mi cuenta"
                    >
                      <User size={22} className="text-white transition-transform duration-300 hover:scale-110" />
                    </button>
                    {showUserMenu && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-terciario border border-white/20 rounded-lg shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[9999]">
                        <div className="px-4 py-2 border-b border-white/10">
                          <p className="text-sm font-medium text-white">
                            {user.nombre || user.username || 'Usuario'}
                          </p>
                        </div>
                        <Link
                          href="/cuenta"
                          className="block px-4 py-2.5 hover:bg-white/10 transition-colors text-sm text-white font-medium"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Mi Cuenta
                        </Link>
                        <Link
                          href="/contacto"
                          className="block px-4 py-2.5 hover:bg-white/10 transition-colors text-sm text-white font-medium"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Contacto
                        </Link>
                        <Link
                          href="/login"
                          className="block px-4 py-2.5 hover:bg-white/10 transition-colors text-sm text-white font-medium flex items-center gap-2"
                          onClick={() => logout()}
                        >
                          <LogOut size={18} />
                          Cerrar sesión
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={getLoginUrl()}
                    className="p-2 hover:bg-white/10 transition-all duration-300 rounded-lg opacity-50"
                    aria-label="Iniciar sesión"
                  >
                    <User size={22} className="text-white transition-transform duration-300 hover:scale-110" />
                  </Link>
                )}

                {/* Shopping Cart */}
                <button
                  onClick={open}
                  className="relative p-2 hover:bg-white/10 transition-all duration-300 rounded-lg"
                >
                  <ShoppingCart size={22} className="text-white transition-transform duration-300 hover:scale-110" />
                  {summary.cantidadItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-principal text-xs font-bold rounded-full min-w-[20px] h-[20px] px-1.5 flex items-center justify-center shadow-lg border-2 border-principal">
                      {summary.cantidadItems}
                    </span>
                  )}
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 hover:bg-white/10 transition-all duration-300 rounded-lg"
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
          </div>
        </div>

        {/* Parte Inferior: Links del Menú - Solo Desktop */}
        <nav
          className={`hidden md:block transition-all duration-500 ${
            shouldShowBackground
              ? actualTheme === 'dark'
                ? "shadow-md bg-secundario text-white"
                : "shadow-md bg-white text-terciario"
              : "bg-transparent"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-12 md:h-14">
              <div className="flex items-center gap-4 lg:gap-6">
                {menuLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                  
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
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[100] transition-all duration-300 ease-out ${
          isMobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-principal shadow-2xl transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header del Menu Mobile */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {user.nombre || user.username || 'Usuario'}
                    </p>
                  </div>
                </div>
              ) : (
                <Link
                  href={getLoginUrl()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <User size={20} />
                  <span className="text-sm">Iniciar sesión</span>
                </Link>
              )}
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={24} className="text-white" />
            </button>
          </div>

          {/* Menu Links */}
          <div className="p-4 space-y-2">
            {menuLinks.map((link, index) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-4 px-4 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-white/20 text-white font-medium"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                  style={{
                    animationDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms'
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Footer del Menu Mobile */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
            {isAuthenticated && user && (
              <div className="space-y-2">
                <Link
                  href="/cuenta"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all"
                >
                  Mi Cuenta
                </Link>
                <Link
                  href="/contacto"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all"
                >
                  Contacto
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 py-3 px-4 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all"
                >
                  <LogOut size={18} />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isOpen} onClose={close} />
    </>
  );
}

