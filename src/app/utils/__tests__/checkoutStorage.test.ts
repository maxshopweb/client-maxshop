import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clearStorageExceptCartAndLocation } from '../checkoutStorage.utils';

const mockClearAuthCookies = vi.hoisted(() => vi.fn());

vi.mock('../cookies', () => ({
  clearAuthCookies: mockClearAuthCookies,
}));

const STORAGE_PRESERVE = ['cart-storage', 'ubicacion', 'theme'];
const STORAGE_TO_REMOVE = ['auth-storage', 'checkout-storage'];

beforeEach(() => {
  mockClearAuthCookies.mockClear();
  const store = new Map<string, string>();
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store.get(key) ?? null);
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { store.set(key, value); });
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => { store.delete(key); });
  STORAGE_PRESERVE.forEach((key) => localStorage.setItem(key, 'preserved'));
  STORAGE_TO_REMOVE.forEach((key) => localStorage.setItem(key, 'to-remove'));
});

describe('clearStorageExceptCartAndLocation', () => {
  it('removes auth-storage and checkout-storage from localStorage', () => {
    clearStorageExceptCartAndLocation();
    expect(localStorage.getItem('auth-storage')).toBeNull();
    expect(localStorage.getItem('checkout-storage')).toBeNull();
  });

  it('calls clearAuthCookies', () => {
    clearStorageExceptCartAndLocation();
    expect(mockClearAuthCookies).toHaveBeenCalledOnce();
  });

  it('preserves cart-storage', () => {
    clearStorageExceptCartAndLocation();
    expect(localStorage.getItem('cart-storage')).toBe('preserved');
  });

  it('preserves ubicacion', () => {
    clearStorageExceptCartAndLocation();
    expect(localStorage.getItem('ubicacion')).toBe('preserved');
  });

  it('preserves theme', () => {
    clearStorageExceptCartAndLocation();
    expect(localStorage.getItem('theme')).toBe('preserved');
  });

  it('does not call removeItem on preserve keys', () => {
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
    clearStorageExceptCartAndLocation();
    const removedKeys = removeItemSpy.mock.calls.map(([key]) => key);
    expect(removedKeys).not.toContain('cart-storage');
    expect(removedKeys).not.toContain('ubicacion');
    expect(removedKeys).not.toContain('theme');
  });
});
