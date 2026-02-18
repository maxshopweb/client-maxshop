/**
 * URL base para servir archivos (productos, banners).
 * Cambiar aquí o con NEXT_PUBLIC_FILES_BASE_URL afecta a toda la app.
 */
export const FILES_BASE_URL =
  process.env.NEXT_PUBLIC_FILES_BASE_URL ?? 'https://files.maxshop.com.ar';

/**
 * Construye la URL pública de una imagen a partir del path relativo guardado en BD.
 * Uso: <img src={buildImageUrl(producto.img_principal)} />
 */
export function buildImageUrl(path: string | null | undefined): string {
  if (!path || typeof path !== 'string' || path.trim() === '') return '';
  const base = FILES_BASE_URL.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `${base}/${normalized}`;
}

function isAbsoluteUrl(path: string): boolean {
  return /^https?:\/\//i.test(path);
}

function isLegacyImagePath(path: string): boolean {
  return path.startsWith('/imgs/productos/') || path.startsWith('imgs/productos/');
}

function looksLikeImageFilename(path: string): boolean {
  return /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(path) && !path.includes('/');
}

/**
 * Resuelve una ruta de imagen soportando:
 * - URL absoluta (https://...)
 * - Path nuevo de backend (productos/... o banners/...)
 * - Path legacy (/imgs/productos/...)
 * - Nombre legacy suelto (ej: 620004-01.jpg)
 */
export function resolveProductImageUrl(path: string | null | undefined): string {
  if (!path || typeof path !== 'string') return '';
  const raw = path.trim();
  if (!raw) return '';

  if (isAbsoluteUrl(raw)) return raw;

  if (isLegacyImagePath(raw)) {
    return raw.startsWith('/') ? raw : `/${raw}`;
  }

  if (looksLikeImageFilename(raw)) {
    return `/imgs/productos/${raw}`;
  }

  return buildImageUrl(raw);
}
