/**
 * URL base del API (sin prefijo /api).
 * Ej: https://api.maxshop.com.ar → requests a /marcas, /productos/tienda, etc.
 */
export function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:3001';
  return base.replace(/\/+$/, '');
}
