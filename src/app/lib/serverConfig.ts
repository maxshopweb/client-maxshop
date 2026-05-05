import type { IConfigTienda } from '@/app/types/config-tienda.type';

const base = process.env.NEXT_PUBLIC_API_URL?.trim()?.replace(/\/+$/, '') || 'http://localhost:3001';

/**
 * Fetch config tienda desde el servidor (SSR).
 * Usado en /checkout/resultado para tener datos_bancarios en el primer paint.
 */
export async function getConfigTiendaServer(): Promise<IConfigTienda> {
  const res = await fetch(`${base}/config/tienda`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return defaultConfig();
  const json = await res.json();
  if (json?.success && json?.data) return json.data as IConfigTienda;
  return defaultConfig();
}

function defaultConfig(): IConfigTienda {
  return {
    envio_gratis_minimo: null,
    envio_gratis_activo: true,
    cuotas_sin_interes: null,
    cuotas_sin_interes_activo: true,
    cuotas_sin_interes_minimo: null,
    datos_bancarios: null,
    modo_mantenimiento: false,
    nombre: null,
    direccion: null,
    logo: null,
    telefono: null,
  };
}
