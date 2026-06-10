export const CATALOG_PRODUCTS_PATH = '/tienda/productos';

/** Normaliza el término de búsqueda antes de enviarlo a URL o API. */
export function trimSearchQuery(query: string): string {
  return query.trim();
}

/** Indica si el query tiene contenido buscable. */
export function isSearchQueryActive(query: string, minLength = 1): boolean {
  return trimSearchQuery(query).length >= minLength;
}

/** Construye la URL del catálogo con parámetro `search`. */
export function buildCatalogSearchUrl(search?: string): string {
  const trimmed = trimSearchQuery(search ?? '');
  if (!trimmed) return CATALOG_PRODUCTS_PATH;
  return `${CATALOG_PRODUCTS_PATH}?search=${encodeURIComponent(trimmed)}`;
}

/** URL del catálogo sin filtros de búsqueda (mantiene orden si se pasa). */
export function buildCatalogBaseUrl(options?: {
  orderBy?: string | null;
  order?: string | null;
}): string {
  const params = new URLSearchParams();
  params.set('page', '1');
  params.set('limit', '21');
  if (options?.orderBy && options?.order) {
    params.set('order_by', options.orderBy);
    params.set('order', options.order);
  }
  return `${CATALOG_PRODUCTS_PATH}?${params.toString()}`;
}
