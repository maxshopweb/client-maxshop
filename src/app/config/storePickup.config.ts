import { CONTACT_CONFIG } from '@/app/config/contact.config';
import type { IConfigTienda } from '@/app/types/config-tienda.type';

export function getStorePickupInfo(config?: IConfigTienda | null) {
  const nombre =
    config?.nombre?.trim() ||
    process.env.NEXT_PUBLIC_TIENDA_NOMBRE?.trim() ||
    'MaxShop';

  const direccion =
    config?.direccion?.trim() ||
    process.env.NEXT_PUBLIC_TIENDA_DIRECCION?.trim() ||
    '';

  const telefono =
    config?.telefono?.trim() ||
    process.env.NEXT_PUBLIC_TIENDA_TELEFONO?.trim() ||
    CONTACT_CONFIG.whatsapp.display;

  const mapsQuery =
    process.env.NEXT_PUBLIC_TIENDA_MAPS_QUERY?.trim() ||
    direccion ||
    nombre;

  const mapsEmbedUrl = mapsQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`
    : null;

  return { nombre, direccion, telefono, mapsQuery, mapsEmbedUrl };
}
