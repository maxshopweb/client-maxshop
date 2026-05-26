import { describe, it, expect } from 'vitest';
import { formatCurrencyARS } from '../currency';

describe('formatCurrencyARS', () => {
  it('formats positive integer', () => {
    expect(formatCurrencyARS(1000)).toBe('$1.000,00');
  });

  it('formats decimal number', () => {
    expect(formatCurrencyARS(99.99)).toBe('$99,99');
  });

  it('formats negative number', () => {
    expect(formatCurrencyARS(-500)).toBe('-$500,00');
  });

  it('formats string input', () => {
    expect(formatCurrencyARS('1500.50')).toBe('$1.500,50');
  });

  it('returns $0,00 for null', () => {
    expect(formatCurrencyARS(null)).toBe('$0,00');
  });

  it('returns $0,00 for undefined', () => {
    expect(formatCurrencyARS(undefined)).toBe('$0,00');
  });

  it('returns $0,00 for NaN', () => {
    expect(formatCurrencyARS(NaN)).toBe('$0,00');
  });

  it('formats without symbol', () => {
    expect(formatCurrencyARS(1000, { includeSymbol: false })).toBe('1.000,00');
  });

  it('formats with custom symbol', () => {
    expect(formatCurrencyARS(1000, { symbol: 'US$' })).toBe('US$1.000,00');
  });

  it('formats with custom fraction digits', () => {
    expect(formatCurrencyARS(1000, { fractionDigits: 0 })).toBe('$1.000');
  });

  it('formats large number with thousands separators', () => {
    expect(formatCurrencyARS(1234567.89)).toBe('$1.234.567,89');
  });

  it('formats zero', () => {
    expect(formatCurrencyARS(0)).toBe('$0,00');
  });

  it('formats 0.00', () => {
    expect(formatCurrencyARS(0.00)).toBe('$0,00');
  });

  it('formats very small decimal', () => {
    expect(formatCurrencyARS(0.01)).toBe('$0,01');
  });

  it('handles negative decimal', () => {
    expect(formatCurrencyARS(-1234.56)).toBe('-$1.234,56');
  });

  it('handles string with null fallback', () => {
    expect(formatCurrencyARS('0')).toBe('$0,00');
  });

  it('returns $0,00 for empty string', () => {
    expect(formatCurrencyARS('')).toBe('$0,00');
  });
});
