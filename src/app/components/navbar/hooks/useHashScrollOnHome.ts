"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToHashSectionWhenReady } from "../utils/hashSectionScroll";

/** Al entrar en `/` con hash (p. ej. desde otra ruta) o con hashchange, scrollea a la sección */
export function useHashScrollOnHome() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;
    const id = window.location.hash.slice(1);
    if (!id) return;
    scrollToHashSectionWhenReady(id);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;

    const onHashChange = () => {
      const id = window.location.hash.slice(1);
      if (id) scrollToHashSectionWhenReady(id);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname]);
}
