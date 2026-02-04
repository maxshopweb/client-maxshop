import { clearAuthCookies } from './cookies';

const STORAGE_KEYS_TO_REMOVE = ['auth-storage', 'checkout-storage'] as const;

/**
 * Borra auth, checkout y cookies. Preserva:
 * - cart-storage (productos del carrito)
 * - ubicacion (ubicación del usuario)
 * - theme (tema de la app)
 *
 * Útil al salir del checkout desde Step 1 (Volver) para no guardar datos de guest/checkout.
 */
export function clearStorageExceptCartAndLocation(): void {
  if (typeof window === 'undefined') return;

  clearAuthCookies();
  STORAGE_KEYS_TO_REMOVE.forEach((key) => localStorage.removeItem(key));
}
