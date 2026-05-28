import { describe, expect, it } from 'vitest';
import { matchesSearch, normalizeForSearch } from '../search.utils';

describe('search.utils', () => {
  it('matchesSearch ignora especiales y acentos', () => {
    expect(matchesSearch('Taladro 1/2"', 'taladro 1-2')).toBe(true);
    expect(matchesSearch('Rotomartillo + 1 Batería', 'bateri')).toBe(true);
    expect(matchesSearch('ABC-123', 'abc123')).toBe(true);
    expect(matchesSearch('Producto X', 'zzz')).toBe(false);
  });

  it('normalizeForSearch unifica texto', () => {
    expect(normalizeForSearch('Niño / Niña')).toBe('ninonina');
  });
});
