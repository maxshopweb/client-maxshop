/** Coincide con `href` tipo `/#about-us` en MENU_LINKS */
const HOME_SECTION_HASH = /^\/#([\w-]+)$/;

export function parseHomeSectionHashId(href: string): string | null {
  const m = href.match(HOME_SECTION_HASH);
  return m ? m[1] : null;
}

/**
 * Hace scroll al elemento; reintenta por si el DOM aún no está (SPA, menú móvil cerrándose).
 */
export function scrollToHashSectionWhenReady(
  id: string,
  options?: { maxFrames?: number }
): void {
  const maxFrames = options?.maxFrames ?? 40;
  let frame = 0;

  const step = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    frame++;
    if (frame < maxFrames) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}
