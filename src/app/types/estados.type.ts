// 0 = eliminado, 1 = activo, 2 = inactivo, 3 = pausado
export type EstadoGeneral = 0 | 1 | 2 | 3;

export type EstadoPago = 'pendiente' | 'aprobado' | 'rechazado' | 'cancelado' | 'vencido';

export type EstadoEnvio = 'pendiente' | 'preparando' | 'enviado' | 'en_transito' | 'entregado' | 'cancelado';

export type MetodoPago =
    | 'efectivo'
    | 'tarjeta_debito'
    | 'tarjeta_credito'
    | 'transferencia'
    | 'mercadopago'
    | 'otro';

export type TipoVenta = 'presencial' | 'online' | 'otro';