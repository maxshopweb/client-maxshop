"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function useNavbarScroll() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === '/';
  const shouldShowBackground = !isHomePage || isScrolled;

  return {
    isScrolled,
    shouldShowBackground,
  };
}

