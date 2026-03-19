import type { IConfigTienda } from '@/app/types/config-tienda.type';

const DEFAULT_MIN_ENVIO = 100000;
const DEFAULT_CUOTAS = 3;
const DEFAULT_MIN_CUOTAS = 80000;

export function getEnvioGratisMensaje(config: IConfigTienda | undefined): string {
  const activo = config?.envio_gratis_activo ?? true;
  if (!activo) {
    return 'Condiciones de envío según zona y método seleccionado';
  }
  const min = config?.envio_gratis_minimo ?? DEFAULT_MIN_ENVIO;
  return `Envío gratis en compras superiores a $${min.toLocaleString('es-AR')}`;
}

export function getCuotasSinInteresMensaje(config: IConfigTienda | undefined): string {
  const activo = config?.cuotas_sin_interes_activo ?? true;
  if (!activo) {
    return 'Financiación disponible con Mercado Pago';
  }
  const n = config?.cuotas_sin_interes ?? DEFAULT_CUOTAS;
  const min = config?.cuotas_sin_interes_minimo ?? DEFAULT_MIN_CUOTAS;
  return `${n} cuotas sin interés en compras superiores a $${min.toLocaleString('es-AR')}`;
}

export function getPromoMessages(config: IConfigTienda | undefined): string[] {
  const envioActivo = config?.envio_gratis_activo ?? true;
  const cuotasActivo = config?.cuotas_sin_interes_activo ?? true;
  const messages: string[] = [];

  if (envioActivo) {
    messages.push(getEnvioGratisMensaje(config).toUpperCase());
  }

  if (cuotasActivo) {
    messages.push(`${config?.cuotas_sin_interes ?? DEFAULT_CUOTAS} CUOTAS SIN INTERÉS`);
  }

  if (messages.length === 0) {
    messages.push('PROMOCIONES ACTUALIZADAS EN TIENDA');
  }

  return messages;
}
