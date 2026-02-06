import type { IConfigTienda } from '@/app/types/config-tienda.type';

const DEFAULT_MIN_ENVIO = 100000;
const DEFAULT_CUOTAS = 3;
const DEFAULT_MIN_CUOTAS = 80000;

export function getEnvioGratisMensaje(config: IConfigTienda | undefined): string {
  const min = config?.envio_gratis_minimo ?? DEFAULT_MIN_ENVIO;
  return `Envío gratis en compras superiores a $${min.toLocaleString('es-AR')}`;
}

export function getCuotasSinInteresMensaje(config: IConfigTienda | undefined): string {
  const n = config?.cuotas_sin_interes ?? DEFAULT_CUOTAS;
  const min = config?.cuotas_sin_interes_minimo ?? DEFAULT_MIN_CUOTAS;
  return `${n} cuotas sin interés en compras superiores a $${min.toLocaleString('es-AR')}`;
}

export function getPromoMessages(config: IConfigTienda | undefined): string[] {
  return [
    getEnvioGratisMensaje(config).toUpperCase(),
    ((config?.cuotas_sin_interes ?? DEFAULT_CUOTAS) + ' CUOTAS SIN INTERÉS'),
  ];
}
