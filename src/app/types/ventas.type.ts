import { EstadoPago, EstadoEnvio, TipoVenta, MetodoPago } from './estados.type';
import type { IUsuarios } from './user';
import type { IProductos } from './producto.type';

// ========================================
// TIPOS PRINCIPALES
// ========================================

export interface IVenta {
    id_venta: number;
    /** Código de operación para el cliente (ej. MAX-00000001) */
    cod_interno?: string | null;
    id_usuario?: string | null;
    fecha?: Date | null;
    id_cliente?: string | null;
    total_sin_iva?: number | null;
    total_con_iva?: number | null;
    descuento_total?: number | null;
    total_neto?: number | null;
    metodo_pago?: MetodoPago | null;
    estado_pago?: EstadoPago | null;
    estado_envio?: EstadoEnvio | null;
    id_envio?: string | null;
    tipo_venta?: TipoVenta | null;
    observaciones?: string | null;
    factura_url?: string | null;
    creado_en?: Date | null;
    actualizado_en?: Date | null;
    /** Referencia de pago manual (ej. número de operación) cuando no viene de Mercado Pago. */
    referencia_pago_manual?: string | null;
    /** Referencia de facturación (ej. número de comprobante externo). */
    referencia_facturacion?: string | null;
    // Relaciones
    usuario?: IUsuarios | null;
    cliente?: {
        id_cliente?: string | null;
        id_usuario: string;
        direccion?: string | null;
        altura?: string | null;
        piso?: string | null;
        dpto?: string | null;
        cod_postal?: number | null;
        ciudad?: string | null;
        provincia?: string | null;
        usuario?: IUsuarios | null;
    } | null;
    detalles?: IVentaDetalle[];
    envio?: IEnvios | null;
    /** Direcciones asociadas a la venta (envío/facturación según tipo). */
    direcciones?: IDireccionVenta[];
    /** Pagos de Mercado Pago asociados (código transacción = payment_id, modo de pago, etc.). */
    mercado_pago_payments?: IMercadoPagoPayment[];
}

/** Dirección asociada a una venta (respuesta del API). Permite discriminar envío vs facturación por tipo. */
export interface IDireccionVenta {
    id_direccion: string;
    id_usuario?: string | null;
    id_venta?: number | null;
    nombre?: string | null;
    direccion?: string | null;
    altura?: string | null;
    piso?: string | null;
    dpto?: string | null;
    cod_postal?: number | null;
    ciudad?: string | null;
    provincia?: string | null;
    pais?: string | null;
    /** Tipo de dirección: ej. "envio" | "facturacion" para discriminar en el admin. */
    tipo?: string | null;
    direccion_formateada?: string | null;
}

/** Pago de Mercado Pago asociado a una venta (para mostrar referencia y modo de pago en el admin). */
export interface IMercadoPagoPayment {
    payment_id: string;
    payment_method_id?: string | null;
    payment_type_id?: string | null;
    status_mp?: string | null;
    status_detail?: string | null;
    date_approved?: string | null;
    card_info?: { last_four_digits?: string; cardholder?: { name?: string } } | null;
    [key: string]: unknown;
}

export interface IVentaDetalle {
    id_detalle: number;
    id_venta?: number | null;
    id_prod?: number | null;
    cantidad?: number | null;
    precio_unitario?: number | null;
    descuento_aplicado?: number | null;
    sub_total?: number | null;
    evento_aplicado?: number | null;
    tipo_descuento?: 'porcentaje' | 'monto_fijo' | null;
    /** Bonificación porcentual aplicada en esta línea (0-100). */
    bonificacion_porcentaje?: number | null;
    // Relaciones
    venta?: IVenta | null;
    producto?: IProductos | null;
    evento?: any | null;
}

export interface IEnvios {
    id_envio: string;
    id_venta?: number | null;
    empresa_envio?: string | null;
    cod_seguimiento?: string | null;
    estado_envio?: EstadoEnvio | null;
    costo_envio?: number | null;
    direccion_envio?: string | null;
    fecha_envio?: Date | null;
    fecha_entrega?: Date | null;
    observaciones?: string | null;
    // Códigos de seguimiento (agregados en el servicio)
    codigoTracking?: string | null;
    numeroSeguimiento?: string | null;
    // URLs de consulta (agregadas en el servicio)
    consultaUrl?: string | null;
    trackingUrl?: string | null;
    preEnvioUrl?: string | null;
    envioUrl?: string | null;
    trazasUrl?: string | null;
    // Relaciones
    venta?: IVenta | null;
}

// ========================================
// FILTROS
// ========================================

export interface IVentaFilters {
    // Paginación
    page?: number;
    limit?: number;

    // Ordenamiento
    order_by?: 'fecha' | 'total_neto' | 'creado_en' | 'estado_pago';
    order?: 'asc' | 'desc';

    // Filtros básicos
    busqueda?: string; // Buscar por ID de venta, cliente, DNI, CUIT, etc.
    id_cliente?: string;
    id_usuario?: string;

    // Filtros por fecha
    fecha_desde?: string; // ISO string
    fecha_hasta?: string; // ISO string

    // Filtros por estado
    estado_pago?: EstadoPago;
    estado_envio?: EstadoEnvio;
    metodo_pago?: MetodoPago;
    tipo_venta?: TipoVenta;

    // Filtros por rango
    total_min?: number;
    total_max?: number;

    /** Incluir ventas dadas de baja (estado_pago cancelado). Por defecto el backend no las lista. */
    incluir_canceladas?: boolean;
}

// ========================================
// DTOs
// ========================================

export interface ICreateVentaDTO {
    id_cliente?: string;
    metodo_pago: MetodoPago;
    tipo_venta: TipoVenta;
    observaciones?: string;
    detalles: IVentaDetalleDTO[];
}

export interface IVentaDetalleDTO {
    id_prod: number;
    cantidad: number;
    /** Precio final unitario (con IVA). En checkout online el API lo ignora y usa el catálogo. */
    precio_unitario?: number;
    descuento_aplicado?: number;
    evento_aplicado?: number;
    /** Bonificación porcentual de la línea (0-100). Si no se envía, se usa la del producto. */
    bonificacion_porcentaje?: number | null;
}

export interface IUpdateVentaDTO {
    estado_pago?: EstadoPago;
    estado_envio?: EstadoEnvio;
    metodo_pago?: MetodoPago;
    observaciones?: string;
    id_envio?: string;
    /** Referencia de pago manual (ej. número de operación bancaria). */
    referencia_pago_manual?: string | null;
    /** Referencia de facturación (ej. número de comprobante). */
    referencia_facturacion?: string | null;
}

/** Payload para actualizar datos de envío (número de seguimiento, transporte). */
export interface IUpdateEnvioDTO {
    cod_seguimiento?: string | null;
    empresa_envio?: string | null;
}

// ========================================
// RESPONSES
// ========================================

export interface IApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface IPaginatedResponse<T = any> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ========================================
// TIPOS AUXILIARES PARA LA UI
// ========================================

export interface IVentasTableState {
    selectedIds: number[];
    isAllSelected: boolean;
    sortBy: IVentaFilters['order_by'];
    sortOrder: IVentaFilters['order'];
}

export interface IVentaFormData extends ICreateVentaDTO {
    // Campos adicionales para el formulario
}

export interface IVentaCard {
    id_venta: number;
    fecha: Date;
    total_neto: number;
    estado_pago: EstadoPago;
    estado_envio: EstadoEnvio;
    cliente?: string;
    metodo_pago: MetodoPago;
}

export interface IBulkOperation {
    ids: number[];
    action: 'delete' | 'update_estado_pago' | 'update_estado_envio';
}

// ========================================
// CONSTANTES Y ENUMS
// ========================================

export const VENTA_ORDEN_OPTIONS = [
    { value: 'fecha', label: 'Fecha' },
    { value: 'total_neto', label: 'Total' },
    { value: 'creado_en', label: 'Fecha de creación' },
    { value: 'estado_pago', label: 'Estado de pago' },
] as const;

export const VENTA_LIMIT_OPTIONS = [
    { value: 10, label: '10 por página' },
    { value: 25, label: '25 por página' },
    { value: 50, label: '50 por página' },
    { value: 100, label: '100 por página' },
] as const;

export const ESTADO_PAGO_OPTIONS: { value: EstadoPago; label: string; color: string }[] = [
    { value: 'pendiente', label: 'Pendiente', color: 'orange' },
    { value: 'aprobado', label: 'Aprobado', color: 'green' },
    { value: 'rechazado', label: 'Rechazado', color: 'red' },
    { value: 'cancelado', label: 'Cancelado', color: 'gray' },
    { value: 'vencido', label: 'Vencido', color: 'gray' },
];

export const ESTADO_ENVIO_OPTIONS: { value: EstadoEnvio; label: string; color: string }[] = [
    { value: 'pendiente', label: 'Pendiente', color: 'yellow' },
    { value: 'preparando', label: 'Preparando', color: 'blue' },
    { value: 'enviado', label: 'Enviado', color: 'purple' },
    { value: 'en_transito', label: 'En tránsito', color: 'indigo' },
    { value: 'entregado', label: 'Entregado', color: 'green' },
    { value: 'cancelado', label: 'Cancelado', color: 'red' },
];

export const METODO_PAGO_OPTIONS: { value: MetodoPago; label: string }[] = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta_debito', label: 'Tarjeta Débito' },
    { value: 'tarjeta_credito', label: 'Tarjeta Crédito' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'mercadopago', label: 'MercadoPago' },
    { value: 'otro', label: 'Otro' },
];

export const TIPO_VENTA_OPTIONS: { value: TipoVenta; label: string }[] = [
    { value: 'presencial', label: 'Presencial' },
    { value: 'online', label: 'Online' },
    { value: 'otro', label: 'Otro' },
];

// ========================================
// TYPE GUARDS Y HELPERS
// ========================================

export function isVentaCompleta(venta: Partial<IVenta>): venta is IVenta {
    return (
        typeof venta.id_venta === 'number' &&
        venta.fecha !== undefined &&
        venta.total_neto !== undefined
    );
}

export function getEstadoPagoColor(estado: EstadoPago): string {
    const option = ESTADO_PAGO_OPTIONS.find(opt => opt.value === estado);
    return option?.color || 'gray';
}

export function getEstadoEnvioColor(estado: EstadoEnvio): string {
    const option = ESTADO_ENVIO_OPTIONS.find(opt => opt.value === estado);
    return option?.color || 'gray';
}

export function formatPrecio(precio: number | string | null | undefined): string {
    if (precio === null || precio === undefined) return '$0';
    const numPrecio = typeof precio === 'string' ? parseFloat(precio) : precio;
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(numPrecio);
}

export function formatFecha(fecha: Date | string | null | undefined): string {
    if (!fecha) return '-';
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return new Intl.DateTimeFormat('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

