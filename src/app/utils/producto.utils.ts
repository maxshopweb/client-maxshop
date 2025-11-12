import type { IProductos, StockStatus, IStockInfo } from '@/app/types/producto.type';

export function getStockStatus(producto: IProductos): StockStatus {
    const stock = producto.stock ?? 0;
    const stockMin = producto.stock_min ?? 10;

    if (stock === 0) return 'sin_stock';
    if (stock <= stockMin) return 'stock_bajo';
    if (stock <= stockMin * 3) return 'stock_medio';
    return 'stock_alto';
}

export function getStockInfo(producto: IProductos): IStockInfo {
    const status = getStockStatus(producto);
    const cantidad = producto.stock ?? 0;

    const config: Record<StockStatus, { color: string; label: string }> = {
        sin_stock: {
            color: 'bg-red-100 text-red-800 border-red-200',
            label: 'Sin stock',
        },
        stock_bajo: {
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            label: 'Stock bajo',
        },
        stock_medio: {
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            label: 'Stock medio',
        },
        stock_alto: {
            color: 'bg-green-100 text-green-800 border-green-200',
            label: 'Stock disponible',
        },
    };

    return {
        cantidad,
        status,
        ...config[status],
    };
}

/**
 * Calcula precio con IVA
 */
export function calcularPrecioConIva(
    precio: number,
    porcentajeIva: number = 21
): number {
    return precio * (1 + porcentajeIva / 100);
}

/**
 * Formatea precio para mostrar
 */
export function formatearPrecio(precio: number | null | undefined): string {
    if (!precio) return '$0.00';
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(precio);
}

/**
 * Trunca descripción para cards
 */
export function truncarDescripcion(desc: string | null | undefined, maxLength: number = 100): string {
    if (!desc) return '';
    if (desc.length <= maxLength) return desc;
    return desc.substring(0, maxLength) + '...';
}

/**
 * Genera slug para URLs amigables
 */
export function generarSlug(nombre: string, id: number): string {
    const slug = nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return `${slug}-${id}`;
}