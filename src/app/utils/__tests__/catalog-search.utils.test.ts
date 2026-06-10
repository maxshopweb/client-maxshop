import { describe, expect, it } from 'vitest';
import {
  buildCatalogBaseUrl,
  buildCatalogSearchUrl,
  CATALOG_PRODUCTS_PATH,
  isSearchQueryActive,
  trimSearchQuery,
} from '../catalog-search.utils';

describe('catalog-search.utils', () => {
  describe('trimSearchQuery', () => {
    it('recorta espacios', () => {
      expect(trimSearchQuery('  taladro  ')).toBe('taladro');
    });
  });

  describe('isSearchQueryActive', () => {
    it('retorna false para string vacío', () => {
      expect(isSearchQueryActive('')).toBe(false);
      expect(isSearchQueryActive('   ')).toBe(false);
    });

    it('retorna true con al menos un carácter', () => {
      expect(isSearchQueryActive('a')).toBe(true);
    });
  });

  describe('buildCatalogSearchUrl', () => {
    it('retorna catálogo base sin query', () => {
      expect(buildCatalogSearchUrl()).toBe(CATALOG_PRODUCTS_PATH);
      expect(buildCatalogSearchUrl('   ')).toBe(CATALOG_PRODUCTS_PATH);
    });

    it('codifica el parámetro search', () => {
      expect(buildCatalogSearchUrl('taladro 12v')).toBe(
        '/tienda/productos?search=taladro%2012v'
      );
    });
  });

  describe('buildCatalogBaseUrl', () => {
    it('incluye paginación por defecto', () => {
      expect(buildCatalogBaseUrl()).toBe('/tienda/productos?page=1&limit=21');
    });

    it('conserva orden si se pasa', () => {
      expect(buildCatalogBaseUrl({ orderBy: 'precio', order: 'asc' })).toBe(
        '/tienda/productos?page=1&limit=21&order_by=precio&order=asc'
      );
    });
  });
});
