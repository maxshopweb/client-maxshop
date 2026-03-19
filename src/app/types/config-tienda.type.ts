/**
 * Datos bancarios para transferencia / efectivo.
 * Alineado con API y reutilizado en checkout resultado.
 */
export interface IDatosBancarios {
  banco: string;
  tipo_cuenta: string;
  numero_cuenta: string;
  cbu?: string | null;
  alias?: string | null;
  titular: string;
  cuit?: string | null;
  instrucciones?: string | null;
}

export interface IConfigTienda {
  envio_gratis_minimo: number | null;
  envio_gratis_activo: boolean;
  cuotas_sin_interes: number | null;
  cuotas_sin_interes_activo: boolean;
  cuotas_sin_interes_minimo: number | null;
  datos_bancarios: IDatosBancarios | null;
}

export interface IUpdateConfigTiendaDTO {
  envio_gratis_minimo?: number;
  envio_gratis_activo?: boolean;
  cuotas_sin_interes?: number;
  cuotas_sin_interes_activo?: boolean;
  cuotas_sin_interes_minimo?: number;
  datos_bancarios?: Partial<IDatosBancarios> | null;
}
