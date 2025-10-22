import { ISubcategoria } from "./categoria.type";
import { EstadoGeneral } from "./estados.type";
import { IIva } from "./iva.type";
import { IMarca } from "./marca.type";

export interface IProductos {
    id_prod: number;
    id_cat?: number | null;
    id_subcat?: number | null;
    id_interno?: string | null;
    cod_sku?: string | null;
    nombre?: string | null;
    descripcion?: string | null; // ✅ Cambiar de "desc" a "descripcion"
    modelo?: string | null;
    id_marca?: number | null;
    precio_mayorista?: number | null;
    precio_minorista?: number | null;
    precio_evento?: number | null;
    precio?: number | null;
    id_iva?: number | null;
    stock?: number | null;
    stock_min?: number | null;
    stock_mayorista?: number | null;
    img_principal?: string | null;
    imagenes?: string[] | null;
    destacado?: boolean | null;
    financiacion?: boolean | null;
    creado_en?: Date | null;
    actualizado_en?: Date | null;
    estado?: EstadoGeneral | null;
    // Relaciones
    subcategoria?: ISubcategoria | null;
    marca?: IMarca | null;
    iva?: IIva | null;
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

    // Filtros por relaciones
    id_subcat?: number;
    id_cat?: number;
    id_marca?: number;

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
    nombre: string;
    precio: number;
    stock: number;

    // Opcionales
    id_cat?: number;
    id_subcat?: number; // ✅ Hacer opcional
    descripcion?: string; // ✅ Cambiar de "desc" a "descripcion"
    cod_sku?: string;
    id_interno?: string;
    modelo?: string;
    id_marca?: number;
    precio_mayorista?: number;
    precio_minorista?: number;
    precio_evento?: number;
    id_iva?: number;
    stock_min?: number;
    stock_mayorista?: number;
    img_principal?: string;
    imagenes?: string[];
    destacado?: boolean;
    financiacion?: boolean;
}

export interface IUpdateProductoDTO {
    nombre?: string;
    descripcion?: string;
    cod_sku?: string;
    id_interno?: string;
    modelo?: string;
    id_cat?: number;
    id_subcat?: number;
    id_marca?: number;
    precio?: number;
    precio_mayorista?: number;
    precio_minorista?: number;
    precio_evento?: number;
    id_iva?: number;
    stock?: number;
    stock_min?: number;
    stock_mayorista?: number;
    img_principal?: string;
    imagenes?: string[];
    destacado?: boolean;
    financiacion?: boolean;
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