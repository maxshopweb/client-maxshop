"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";

export default function TopHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Buscando:", searchQuery);
  };

  return (
    <header className="bg-terciario text-white py-3 md:py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logos/logo-negativo.svg"
              alt="MaxShop"
              width={120}
              height={40}
              className="h-8 md:h-10 w-auto"
            />
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-l-lg bg-white text-terciario focus:outline-none focus:ring-2 focus:ring-principal text-sm"
              />
              <button
                type="submit"
                className="bg-principal hover:bg-principal/90 px-4 md:px-6 py-2.5 rounded-r-lg font-extrabold text-xs md:text-sm tracking-wide transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Search size={18} className="md:w-5 md:h-5" />
                <span className="hidden lg:inline">BUSCAR</span>
              </button>
            </div>
          </form>

          {/* User & Cart - Desktop */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-shrink-0">
            {/* User Account */}
            <Link
              href="/cuenta"
              className="flex items-center gap-2 hover:text-principal transition-colors"
              aria-label="Mi cuenta"
            >
              <User size={24} />
            </Link>

            {/* Shopping Cart */}
            <Link
              href="/tienda/carrito"
              className="flex items-center gap-2 lg:gap-3 hover:text-principal transition-colors"
            >
              <div className="relative">
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-principal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  0
                </span>
              </div>
              <div className="text-xs lg:text-sm hidden lg:block">
                <div className="font-semibold">Mi Carrito</div>
                <div className="text-principal font-extrabold">$0.00</div>
              </div>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2 hover:text-principal transition-colors"
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>

            {/* Mobile Cart */}
            <Link
              href="/tienda/carrito"
              className="relative p-2 hover:text-principal transition-colors"
            >
              <ShoppingCart size={20} />
              <span className="absolute top-0 right-0 bg-principal text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                0
              </span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 hover:text-principal transition-colors"
              aria-label="Menú"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <form onSubmit={handleSearch} className="mt-3 md:hidden">
            <div className="flex">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-l-lg bg-white text-terciario focus:outline-none focus:ring-2 focus:ring-principal text-sm"
              />
              <button
                type="submit"
                className="bg-principal px-4 py-2.5 rounded-r-lg font-extrabold text-sm"
              >
                <Search size={18} />
              </button>
            </div>
          </form>
        )}
      </div>
    </header>
  );
}
