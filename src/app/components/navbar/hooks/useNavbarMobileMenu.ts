"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function useNavbarMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Cerrar mobile menu al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

