/**
 * Normalización global para búsquedas: ignora mayúsculas, acentos y caracteres especiales.
 */

/** trim → minúsculas → sin acentos → solo letras y números */
export function normalizeForSearch(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]/g, '');
}

export function prepareSearchQuery(value: string): { raw: string; normalized: string } {
  const raw = value.trim();
  return { raw, normalized: normalizeForSearch(raw) };
}

/** Sin acentos; conserva espacios y signos. */
export function stripDiacritics(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

/** Variantes para API (raw, sin acentos, alfanumérico). */
export function getSearchVariants(value: string): string[] {
  const { raw, normalized } = prepareSearchQuery(value);
  const accentStripped = stripDiacritics(raw);
  const variants = new Set<string>();
  if (raw.length > 0) variants.add(raw);
  if (accentStripped.length > 0) variants.add(accentStripped);
  if (normalized.length > 0) variants.add(normalized);
  return [...variants];
}

/** Comparación en memoria (navbar, combobox, maestros locales). */
export function matchesSearch(haystack: string, needle: string): boolean {
  const term = normalizeForSearch(needle);
  if (!term) return false;
  return normalizeForSearch(haystack).includes(term);
}

/** Patrón ILIKE/LIKE con término normalizado (`%taladro12%`). */
export function normalizedLikePattern(value: string): string | null {
  const n = normalizeForSearch(value);
  return n.length > 0 ? `%${n}%` : null;
}
