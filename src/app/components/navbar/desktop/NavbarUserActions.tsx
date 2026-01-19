"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, UserCircle, ShoppingCart, Menu, X, LogIn, UserPlus, LogOut } from "lucide-react";
import type { IUsuario } from "@/app/types/user";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

interface NavbarUserActionsProps {
  isAuthenticated: boolean;
  loginUrl: string;
  user: IUsuario | null;
  cantidadItems: number;
  isMobileMenuOpen: boolean;
  onCartClick: () => void;
  onMobileMenuToggle: () => void;
}

export default function NavbarUserActions({
  isAuthenticated,
  loginUrl,
  user,
  cantidadItems,
  isMobileMenuOpen,
  onCartClick,
  onMobileMenuToggle,
}: NavbarUserActionsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setIsHovered(false);
    router.push('/');
  };

  // Cerrar popup cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsHovered(false);
      }
    };

    if (isHovered) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isHovered]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  return (
    <div className="flex items-center gap-2 md:gap-2 flex-shrink-0">
      {/* User Account / Login with Popup */}
      <div
        ref={containerRef}
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          href={isAuthenticated ? "/mi-cuenta" : loginUrl}
          className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-all duration-300 rounded-lg"
          aria-label={isAuthenticated ? "Mi cuenta" : "Iniciar sesión"}
        >
          {isAuthenticated ? (
            <UserCircle size={22} className="text-white" />
          ) : (
            <User size={22} className="text-white" />
          )}
        </Link>

        {/* Popup */}
        {isHovered && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
            {isAuthenticated && user ? (
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-principal/10 flex items-center justify-center flex-shrink-0">
                    <UserCircle size={20} className="text-principal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.nombre} {user.apellido || ""}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/mi-cuenta"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mb-1"
                  onClick={() => setIsHovered(false)}
                >
                  <UserCircle size={16} className="text-principal" />
                  Ver perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={16} className="text-red-600" />
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="p-2">
                <Link
                  href={loginUrl}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mb-1"
                  onClick={() => setIsHovered(false)}
                >
                  <LogIn size={16} className="text-principal" />
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsHovered(false)}
                >
                  <UserPlus size={16} className="text-principal" />
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Shopping Cart */}
      <button
        onClick={onCartClick}
        className="relative p-2 hover:bg-white/10 transition-all duration-300 rounded-lg"
      >
        <ShoppingCart size={22} className="text-white transition-transform duration-300 hover:scale-110" />
        {cantidadItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-principal text-xs font-bold rounded-full min-w-[20px] h-[20px] px-1.5 flex items-center justify-center shadow-lg border-2 border-principal">
            {cantidadItems}
          </span>
        )}
      </button>

      {/* Mobile Menu Button */}
      <button
        onClick={onMobileMenuToggle}
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
  );
}
