import axios from 'axios';

function isLikelyTechnicalMessage(msg: string): boolean {
  const m = msg.toLowerCase();
  if (m.length > 500) return true;
  if (/\n/.test(msg)) return true;
  if (/prisma/i.test(msg)) return true;
  if (/postgres/i.test(msg)) return true;
  if (/invalid `/i.test(msg)) return true;
  if (/unique constraint/i.test(msg)) return true;
  if (/foreign key/i.test(msg)) return true;
  if (/request failed with status code/i.test(m)) return true;
  if (/network error/i.test(m)) return true;
  if (/econnrefused/i.test(m)) return true;
  if (/timeout/i.test(m) && /exceeded/i.test(m)) return true;
  return false;
}

/**
 * Mensaje seguro para toasts / UI a partir de errores de Axios, Error u otros.
 * Prioriza `error` o `message` del cuerpo JSON del backend; evita filtrar detalles técnicos.
 */
export function getClientErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    let fromApi = '';
    if (data && typeof data === 'object') {
      const o = data as { error?: unknown; message?: unknown };
      if (typeof o.error === 'string') fromApi = o.error.trim();
      else if (typeof o.message === 'string') fromApi = o.message.trim();
    }
    if (fromApi && !isLikelyTechnicalMessage(fromApi)) return fromApi;
    if (!error.response) {
      return 'No hay conexión. Verificá tu red e intentá de nuevo.';
    }
    return fallback;
  }
  if (error instanceof Error) {
    const msg = error.message?.trim() ?? '';
    if (msg && !isLikelyTechnicalMessage(msg)) return msg;
  }
  return fallback;
}
