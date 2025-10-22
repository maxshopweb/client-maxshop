// 1 = activo, 2 = inactivo, 0 = eliminado
export type EstadoGeneral = 0 | 1 | 2;

export type EstadoPago = 'pendiente' | 'aprobado' | 'rechazado' | 'cancelado';

export type EstadoEnvio = 'pendiente' | 'preparando' | 'enviado' | 'en_transito' | 'entregado' | 'cancelado';