const STORAGE_KEY = 'maxshop_checkout_result_was_guest';

/** Marca que el pedido en pantalla de resultado fue hecho como invitado (sobrevive logout/reset). */
export function markCheckoutResultAsGuest(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, '1');
}

export function wasCheckoutResultGuest(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(STORAGE_KEY) === '1';
}

export function clearCheckoutResultGuestFlag(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}
