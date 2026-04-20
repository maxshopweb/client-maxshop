const CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*-';

/** Contraseña fuerte para Firebase (mín. 6 caracteres; aquí 18). */
export function generateStaffPassword(length = 18): string {
  const buf = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < length; i++) buf[i] = Math.floor(Math.random() * 256);
  }
  let out = '';
  for (let i = 0; i < length; i++) {
    out += CHARSET[buf[i]! % CHARSET.length];
  }
  return out;
}

/** Parte local del email (sin @). Alineado con validación del backend. */
export function isValidStaffEmailLocalPart(s: string): boolean {
  const t = s.trim();
  if (t.length < 2 || t.length > 64) return false;
  if (t.includes('@')) return false;
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?$/.test(t);
}

export function getStaffEmailDomain(): string {
  const raw = (process.env.NEXT_PUBLIC_ADMIN_STAFF_EMAIL_DOMAIN || 'maxshop.com').trim();
  return raw.replace(/^@+/, '').toLowerCase();
}
