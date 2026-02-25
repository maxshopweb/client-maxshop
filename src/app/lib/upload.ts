/**
 * URL base para servir archivos (productos, banners).
 * Cambiar aquí o con NEXT_PUBLIC_FILES_BASE_URL afecta a toda la app.
 */
export const FILES_BASE_URL =
  process.env.NEXT_PUBLIC_FILES_BASE_URL ?? 'https://files.maxshop.com.ar';

/**
 * Codifica cada segmento del path para URL (espacios → %20, etc.).
 * Normaliza la extensión del archivo a minúsculas para coincidir con los archivos en FTP.
 * Las barras se mantienen como separadores.
 */
function encodePathForUrl(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return '';
  let normalized = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  // Extensión en minúsculas para que la URL coincida con archivos en FTP (.PNG/.JPG en BD → .png/.jpg en URL)
  normalized = normalized.replace(/\.[a-zA-Z0-9]+$/, (ext) => ext.toLowerCase());
  return normalized
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

/**
 * Construye la URL pública de una imagen a partir del path relativo guardado en BD.
 * Codifica espacios y caracteres especiales (ej. nombres con espacios desde FTP/CSV).
 * Uso: <img src={buildImageUrl(producto.img_principal)} />
 */
export function buildImageUrl(path: string | null | undefined): string {
  if (!path || typeof path !== 'string') return '';
  const encoded = encodePathForUrl(path);
  if (!encoded) return '';
  const base = FILES_BASE_URL.replace(/\/$/, '');
  return `${base}/${encoded}`;
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
