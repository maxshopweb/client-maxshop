"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function useNavbarSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  // Limpiar el input cuando cambia la ruta
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      setSearchQuery("");
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  // Limpiar el input cuando se sale de la página
  useEffect(() => {
    const handleBeforeUnload = () => {
      setSearchQuery("");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return {
    searchQuery,
    setSearchQuery,
  };
}

