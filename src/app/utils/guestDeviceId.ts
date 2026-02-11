const STORAGE_KEY = 'maxshop_guest_device_id';

/**
 * Genera un ID único para este dispositivo/navegador.
 * Se usa para que el mismo invitado (mismo dispositivo) reutilice un solo usuario
 * aunque Firebase asigne un nuevo UID anónimo en cada sesión.
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Obtiene el guest device id persistente para invitados.
 * Si no existe, lo genera y guarda en localStorage.
 * Solo tiene efecto en el cliente (localStorage).
 */
export function getGuestDeviceId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id || id.length < 10) {
      id = generateId();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}
