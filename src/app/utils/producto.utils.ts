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
            label: 'Disponible',
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
 * Obtiene el mejor precio sin impuestos disponible del producto.
 */
export function getPrecioSinImpuestos(producto: IProductos): number | null {
    const porcentajeIva = getPorcentajeIva(producto);

    const candidates = [
        producto.precio_sin_iva,
        producto.precio_venta,
        producto.precio_especial,
        producto.precio_pvp,
        producto.precio_campanya,
        producto.precio_evento,
    ];

    for (const value of candidates) {
        if (value != null) {
            const numeric = Number(value);
            if (!Number.isNaN(numeric) && numeric > 0) {
                return numeric;
            }
        }
    }

    if (producto.precio != null && porcentajeIva != null) {
        const precioConIva = Number(producto.precio);
        if (!Number.isNaN(precioConIva) && precioConIva > 0) {
            const divisor = 1 + porcentajeIva / 100;
            if (divisor > 0) {
                return precioConIva / divisor;
            }
        }
    }

    return null;
}

/**
 * Obtiene el precio final con impuestos del producto.
 */
export function getPrecioConImpuestos(producto: IProductos): number | null {
    if (producto.precio != null) {
        const precioConIva = Number(producto.precio);
        if (!Number.isNaN(precioConIva) && precioConIva > 0) {
            return precioConIva;
        }
    }

    const precioBase = getPrecioSinImpuestos(producto);
    if (precioBase != null) {
        const porcentajeIva = getPorcentajeIva(producto);
        if (porcentajeIva != null) {
            return precioBase * (1 + porcentajeIva / 100);
        }
        const precioMinorista = producto.precio_minorista != null ? Number(producto.precio_minorista) : null;
        if (precioMinorista != null && !Number.isNaN(precioMinorista) && precioMinorista > 0) {
            return precioMinorista;
        }
        return precioBase;
    }

    const precioMinorista = producto.precio_minorista != null ? Number(producto.precio_minorista) : null;
    if (precioMinorista != null && !Number.isNaN(precioMinorista) && precioMinorista > 0) {
        return precioMinorista;
    }

    return null;
}

function getPorcentajeIva(producto: IProductos): number | null {
    const ivaData = producto.iva as (typeof producto.iva & { porcentaje?: number | null; porcen_iva?: number | null }) | null;
    if (ivaData?.porcentaje != null) {
        const numeric = Number(ivaData.porcentaje);
        if (!Number.isNaN(numeric)) {
            return numeric;
        }
    }
    if ((ivaData as any)?.porcen_iva != null) {
        const numeric = Number((ivaData as any).porcen_iva);
        if (!Number.isNaN(numeric)) {
            return numeric;
        }
    }
    if (producto.iva_monto != null) {
        const base =
            producto.precio_sin_iva ??
            producto.precio_venta ??
            producto.precio_especial ??
            producto.precio_pvp ??
            producto.precio_campanya ??
            null;
        if (base != null) {
            const numericBase = Number(base);
            const ivaMonto = Number(producto.iva_monto);
            if (!Number.isNaN(numericBase) && numericBase > 0 && !Number.isNaN(ivaMonto)) {
                return (ivaMonto / numericBase) * 100;
            }
        }
    }
    return null;
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