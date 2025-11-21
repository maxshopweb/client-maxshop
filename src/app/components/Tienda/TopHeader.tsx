"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, User, ShoppingCart, Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/app/context/ThemeProvider";
import { useAuth } from "@/app/context/AuthContext";
import { useCartStore } from "@/app/stores/cartStore";
import { useCartSidebar } from "@/app/hooks/useCartSidebar";

export default function TopHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { actualTheme, theme, setTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { items, summary } = useCartStore();
  const { isOpen, open, close } = useCartSidebar();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
      // Sincronizar con NavigationBar mediante evento personalizado
      document.dispatchEvent(new CustomEvent('navbar-scroll', { detail: { scrolled } }));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Buscando:", searchQuery);
  };

  return (
    <header
      className={`transition-all duration-500 ${isScrolled
          ? "py-2 shadow-lg bg-principal text-white"
          : "py-4 bg-principal text-white"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 group relative"
          >
            <Image
              src="/logos/logo-positivo.svg"
              alt="MaxShop"
              width={120}
              height={40}
              className="h-8 md:h-10 w-auto transition-transform duration-300 group-hover:scale-105 brightness-0 invert"
            />
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl"
          >
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-l-lg bg-input text-input focus:outline-none focus:ring-2 focus:ring-principal text-sm transition-all duration-200 placeholder:placeholder-input"
              />
              <button
                type="submit"
                className="bg-white hover:bg-white/90 text-principal px-4 md:px-6 py-2.5 rounded-r-lg text-xs md:text-sm font-medium transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Search size={18} className="md:w-5 md:h-5" />
                <span className="hidden lg:inline">Buscar</span>
              </button>
            </div>
          </form>

          {/* User & Cart - Desktop */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4 flex-shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(actualTheme === 'dark' ? 'light' : 'dark')}
              className="relative p-2 hover:bg-white/10 transition-all duration-300 group rounded-lg"
              aria-label="Cambiar tema"
            >
              {actualTheme === 'dark' ? (
                <Sun size={22} className="text-white transition-transform duration-300 group-hover:scale-110" />
              ) : (
                <Moon size={22} className="text-white transition-transform duration-300 group-hover:scale-110" />
              )}
            </button>

            {/* User Account - Only show if authenticated */}
            {isAuthenticated && user ? (
              <div ref={userMenuRef} className="relative z-[9999]">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="relative flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-all duration-300 group rounded-lg"
                  aria-label="Mi cuenta"
                >
                  <User size={22} className="text-white transition-transform duration-300 group-hover:scale-110" />
                  <span className="hidden lg:block text-sm font-medium text-white">
                    {user.nombre || user.username || 'Usuario'}
                  </span>
                </button>
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-terciario border border-white/20 rounded-lg shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[9999]">
                    <Link
                      href="/cuenta"
                      className="block px-4 py-2.5 hover:bg-white/10 transition-colors text-sm text-white font-medium"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Mi Cuenta
                    </Link>
                    <Link
                      href="/ayuda"
                      className="block px-4 py-2.5 hover:bg-white/10 transition-colors text-sm text-white font-medium"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Ayuda
                    </Link>
                    <Link
                      href="/contacto"
                      className="block px-4 py-2.5 hover:bg-white/10 transition-colors text-sm text-white font-medium"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Contacto
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/cuenta"
                className="relative p-2 hover:bg-white/10 transition-all duration-300 group opacity-50 rounded-lg"
                aria-label="Iniciar sesión"
              >
                <User size={22} className="text-white transition-transform duration-300 group-hover:scale-110" />
              </Link>
            )}

            {/* Shopping Cart */}
            <button
              onClick={open}
              className="relative flex items-center gap-2 lg:gap-3 hover:bg-white/10 transition-all duration-300 group rounded-lg p-2"
            >
              <div className="relative">
                <ShoppingCart size={22} className="text-white transition-transform duration-300 group-hover:scale-110" />
                {summary.cantidadItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-principal text-xs font-bold rounded-full min-w-[22px] h-[22px] px-1.5 flex items-center justify-center shadow-lg border-2 border-principal">
                    {summary.cantidadItems}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={() => setTheme(actualTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-white/10 transition-all duration-300 active:scale-95 rounded-lg"
              aria-label="Cambiar tema"
            >
              {actualTheme === 'dark' ? (
                <Sun size={20} className="text-white" />
              ) : (
                <Moon size={20} className="text-white" />
              )}
            </button>

            {/* Mobile Search Button */}
            <button
              onClick={() => {
                setShowMobileSearch(!showMobileSearch);
                setShowMobileMenu(false);
              }}
              className="p-2 hover:bg-white/10 transition-all duration-300 active:scale-95 rounded-lg"
              aria-label="Buscar"
            >
              <Search size={20} className="text-white" />
            </button>

            {/* Mobile Cart */}
            <button
              onClick={open}
              className="relative p-2 hover:bg-white/10 transition-all duration-300 active:scale-95 rounded-lg"
            >
              <ShoppingCart size={20} className="text-white" />
              {summary.cantidadItems > 0 && (
                <span className="absolute top-0 right-0 bg-white text-principal text-xs font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow-lg border-2 border-principal">
                  {summary.cantidadItems}
                </span>
              )}
            </button>

            {/* Mobile User Menu Toggle */}
            {isAuthenticated && user ? (
              <div className="relative z-[9999]">
                <button
                  onClick={() => {
                    setShowMobileMenu(!showMobileMenu);
                    setShowMobileSearch(false);
                  }}
                  className="flex items-center gap-2 px-2 py-2 hover:bg-white/10 transition-all duration-300 active:scale-95 rounded-lg"
                  aria-label="Menú de usuario"
                >
                  <User size={20} className="text-white transition-transform duration-300" />
                  <span className="text-xs font-medium text-white">
                    {user.nombre || user.username || 'Usuario'}
                  </span>
                </button>

                {/* Mobile User Menu - Dropdown */}
                <div
                  className={`absolute top-full right-0 mt-2 w-48 bg-terciario border border-white/20 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-out z-[9999] ${showMobileMenu
                      ? "max-h-96 opacity-100 translate-y-0"
                      : "max-h-0 opacity-0 -translate-y-2"
                    }`}
                >
                  <div className="p-2 space-y-1">
                    <Link
                      href="/cuenta"
                      onClick={() => setShowMobileMenu(false)}
                      className="block px-4 py-2.5 hover:bg-white/10 rounded-lg transition-all duration-200 text-sm text-white font-medium active:scale-[0.98]"
                    >
                      Mi Cuenta
                    </Link>
                    <Link
                      href="/ayuda"
                      onClick={() => setShowMobileMenu(false)}
                      className="block px-4 py-2.5 hover:bg-white/10 rounded-lg transition-all duration-200 text-sm text-white font-medium active:scale-[0.98]"
                    >
                      Ayuda
                    </Link>
                    <Link
                      href="/contacto"
                      onClick={() => setShowMobileMenu(false)}
                      className="block px-4 py-2.5 hover:bg-white/10 rounded-lg transition-all duration-200 text-sm text-white font-medium active:scale-[0.98]"
                    >
                      Contacto
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/cuenta"
                className="p-2 hover:bg-white/10 transition-all duration-300 active:scale-95 opacity-50 rounded-lg"
                aria-label="Iniciar sesión"
              >
                <User size={20} className="text-white transition-transform duration-300" />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${showMobileSearch ? "max-h-20 mt-3 opacity-100" : "max-h-0 mt-0 opacity-0"
            }`}
        >
          <form onSubmit={handleSearch}>
            <div className="flex">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-l-lg bg-input text-input focus:outline-none focus:ring-2 focus:ring-principal text-sm placeholder:placeholder-input"
              />
              <button
                type="submit"
                className="bg-white text-principal px-4 py-2.5 rounded-r-lg font-medium transition-all duration-300 active:scale-95"
              >
                <Search size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
