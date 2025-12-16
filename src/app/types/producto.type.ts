import { ICategoria, ISubcategoria } from "./categoria.type";
import { EstadoGeneral } from "./estados.type";
import { IIva } from "./iva.type";
import { IMarca } from "./marca.type";

export interface IProductos {
    id_prod: number;
    codi_arti: string;
    codi_categoria?: string | null;
    codi_marca?: string | null;
    codi_grupo?: string | null;
    codi_impuesto?: string | null;
    id_interno?: string | null;
    cod_sku?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    modelo?: string | null;
    precio_mayorista?: number | null;
    precio_minorista?: number | null;
    precio_evento?: number | null;
    precio?: number | null;
    precio_sin_iva?: number | null;
    iva_monto?: number | null;
    stock?: number | null;
    stock_min?: number | null;
    stock_mayorista?: number | null;
    unidad_medida?: string | null;
    unidades_por_producto?: number | null;
    codi_barras?: string | null;
    img_principal?: string | null;
    imagenes?: string[] | null; // JSONB
    destacado?: boolean | null;
    financiacion?: boolean | null;
    activo?: string | null;
    creado_en?: Date | null;
    actualizado_en?: Date | null;
    estado?: EstadoGeneral | null;
    // Relaciones
    categoria?: ICategoria | null;
    marca?: IMarca | null;
    grupo?: any | null; // IGrupo
    iva?: IIva | null;
    // Campos legacy para compatibilidad (deprecated, usar códigos)
    id_cat?: number | null;
    id_subcat?: number | null;
    id_marca?: number | null;
    subcategoria?: ISubcategoria | null;
}
// Filtros
export interface IProductoFilters {
    // Paginación
    page?: number;
    limit?: number;

    // Ordenamiento
    order_by?: 'precio' | 'nombre' | 'creado_en' | 'stock';
    order?: 'asc' | 'desc';

    // Filtros básicos
    estado?: EstadoGeneral;
    busqueda?: string;

    // Filtros por relaciones - acepta códigos o IDs
    id_subcat?: number; // Deprecated - mantener por compatibilidad
    id_cat?: number | string; // Puede ser ID o código
    id_marca?: number | string; // Puede ser ID o código
    codi_grupo?: string; // Código de grupo
    codi_impuesto?: string | number; // Código de IVA o ID

    // Filtros por rango
    precio_min?: number;
    precio_max?: number;

    // Filtros booleanos
    destacado?: boolean;
    financiacion?: boolean;

    // Filtro por stock
    stock_bajo?: boolean;
}

// DTOs
export interface ICreateProductoDTO {
    // Requeridos
    codi_arti: string;
    nombre: string;
    precio: number;

    // Opcionales - usar códigos
    codi_categoria?: string;
    codi_marca?: string;
    codi_grupo?: string;
    codi_impuesto?: string;
    descripcion?: string;
    cod_sku?: string;
    id_interno?: string;
    modelo?: string;
    precio_mayorista?: number;
    precio_minorista?: number;
    precio_evento?: number;
    precio_sin_iva?: number;
    stock?: number;
    stock_min?: number;
    stock_mayorista?: number;
    unidad_medida?: string;
    unidades_por_producto?: number;
    codi_barras?: string;
    img_principal?: string;
    imagenes?: string[];
    destacado?: boolean;
    financiacion?: boolean;
    // Campos legacy para compatibilidad
    id_cat?: number;
    id_subcat?: number;
    id_marca?: number;
    id_iva?: number;
}

export interface IUpdateProductoDTO extends Partial<ICreateProductoDTO> {
    estado?: EstadoGeneral;
}

// Responses
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

// =======================================
// TIPOS AUXILIARES PARA LA UI
// =======================================

export interface IProductosTableState {
    selectedIds: number[];
    isAllSelected: boolean;
    sortBy: IProductoFilters['order_by'];
    sortOrder: IProductoFilters['order'];
}

export interface IProductoFormData extends ICreateProductoDTO {
    precio_con_iva?: number;
    margen_ganancia?: number;
}

export interface IProductoCard {
    id_prod: number;
    nombre: string;
    precio: number;
    img_principal: string | null;
    stock: number;
    destacado: boolean;
    marca?: string;
    categoria?: string;
}

export interface IBulkOperation {
    ids: number[];
    action: 'delete' | 'activate' | 'deactivate' | 'destacar' | 'no_destacar';
}

export type StockStatus = 'sin_stock' | 'stock_bajo' | 'stock_medio' | 'stock_alto';

export interface IStockInfo {
    cantidad: number;
    status: StockStatus;
    color: string;
    label: string;
}

// =======================================
// CONSTANTES Y ENUMS
// =======================================

export const PRODUCTO_ORDEN_OPTIONS = [
    { value: 'nombre', label: 'Nombre' },
    { value: 'precio', label: 'Precio' },
    { value: 'creado_en', label: 'Fecha de creación' },
    { value: 'stock', label: 'Stock' },
] as const;

export const PRODUCTO_LIMIT_OPTIONS = [
    { value: 10, label: '10 por página' },
    { value: 25, label: '25 por página' },
    { value: 50, label: '50 por página' },
    { value: 100, label: '100 por página' },
] as const;

// =======================================
// TYPE GUARDS Y HELPERS
// =======================================

export function isProductoCompleto(producto: Partial<IProductos>): producto is IProductos {
    return (
        typeof producto.id_prod === 'number' &&
        typeof producto.nombre === 'string' &&
        typeof producto.precio === 'number'
    );
}

export function hasStock(producto: IProductos): boolean {
    return (producto.stock ?? 0) > 0;
}

export function isStockBajo(producto: IProductos): boolean {
    const stock = producto.stock ?? 0;
    const stockMin = producto.stock_min ?? 0;
    return stock > 0 && stock <= stockMin;
}

// ✅ Helper para obtener el estado del stock
export function getStockStatus(producto: IProductos): StockStatus {
    const stock = producto.stock ?? 0;
    const stockMin = producto.stock_min ?? 10;

    if (stock === 0) return 'sin_stock';
    if (stock <= stockMin) return 'stock_bajo';
    if (stock <= stockMin * 2) return 'stock_medio';
    return 'stock_alto';
}

// ✅ Helper para obtener info visual del stock
export function getStockInfo(producto: IProductos): IStockInfo {
    const cantidad = producto.stock ?? 0;
    const status = getStockStatus(producto);

    const statusConfig: Record<StockStatus, { color: string; label: string }> = {
        sin_stock: { color: 'red', label: 'Sin stock' },
        stock_bajo: { color: 'orange', label: 'Stock bajo' },
        stock_medio: { color: 'yellow', label: 'Stock medio' },
        stock_alto: { color: 'green', label: 'Stock disponible' },
    };

    return {
        cantidad,
        status,
        ...statusConfig[status],
    };
}

// ✅ Helper para formatear precio
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