export type CuponTipo = 'porcentaje' | 'monto_fijo';
export type CuponCanjeEstado = 'aplicado' | 'liberado';

export interface ICupon {
  id_cupon: number;
  codigo: string;
  tipo: CuponTipo;
  valor: number;
  monto_minimo: number;
  usos_maximos: number;
  usos_actuales: number;
  fecha_inicio: string | Date | null;
  fecha_fin: string | Date | null;
  activo: boolean;
  creado_en: string | Date;
  actualizado_en: string | Date;
}

export interface ICuponCanje {
  id_canje: number;
  id_cupon: number;
  id_venta: number;
  monto_aplicado: number;
  estado: CuponCanjeEstado;
  creado_en: string | Date;
  liberado_en: string | Date | null;
  cod_interno?: string | null;
}

export interface ICuponCreatePayload {
  codigo: string;
  tipo: CuponTipo;
  valor: number;
  monto_minimo: number;
  usos_maximos: number;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  activo?: boolean;
}

export type ICuponUpdatePayload = Partial<ICuponCreatePayload>;

export interface ICuponValidateResult {
  valid: boolean;
  message: string;
  monto_descuento?: number;
  codigo?: string;
}
