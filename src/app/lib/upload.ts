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
