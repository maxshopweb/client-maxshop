import { EstadoGeneral } from './estados.type';
import type { IUsuarios } from './user';
import type { IVenta } from './ventas.type';

// ========================================
// TIPOS PRINCIPALES
// ========================================

export interface ICliente {
    id_cliente?: string | null;
    id_usuario: string;
    direccion?: string | null;
    cod_postal?: number | null;
    ciudad?: string | null;
    provincia?: string | null;
    // Relaciones
    usuario?: IUsuarios | null;
    ventas?: IVenta[]; // Historial de ventas
}

// ========================================
// FILTROS
// ========================================

export interface IClienteFilters {
    // Paginación
    page?: number;
    limit?: number;

    // Ordenamiento
    order_by?: 'nombre' | 'email' | 'creado_en' | 'ultimo_login';
    order?: 'asc' | 'desc';

    // Filtros básicos
    busqueda?: string; // Buscar por nombre, email, teléfono
    estado?: EstadoGeneral;
    ciudad?: string;
    provincia?: string;

    // Filtros por fecha
    creado_desde?: string; // ISO string
    creado_hasta?: string; // ISO string
    ultimo_login_desde?: string; // ISO string
    ultimo_login_hasta?: string; // ISO string
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

export interface IClientesTableState {
    selectedIds: string[];
    isAllSelected: boolean;
    sortBy: IClienteFilters['order_by'];
    sortOrder: IClienteFilters['order'];
}

export interface IClienteCard {
    id_usuario: string;
    nombre: string;
    email: string;
    telefono?: string;
    ciudad?: string;
    totalVentas?: number;
    ultimoLogin?: Date;
}

export interface IClienteStats {
    totalVentas: number;
    totalGastado: number;
    promedioVenta: number;
    ultimaVenta?: Date;
    productosComprados: number;
}

// ========================================
// CONSTANTES Y ENUMS
// ========================================

export const CLIENTE_ORDEN_OPTIONS = [
    { value: 'nombre', label: 'Nombre' },
    { value: 'email', label: 'Email' },
    { value: 'creado_en', label: 'Fecha de registro' },
    { value: 'ultimo_login', label: 'Último acceso' },
] as const;

export const CLIENTE_LIMIT_OPTIONS = [
    { value: 10, label: '10 por página' },
    { value: 25, label: '25 por página' },
    { value: 50, label: '50 por página' },
    { value: 100, label: '100 por página' },
] as const;

// ========================================
// TYPE GUARDS Y HELPERS
// ========================================

export function isClienteCompleto(cliente: Partial<ICliente>): cliente is ICliente {
    return (
        typeof cliente.id_usuario === 'string' &&
        cliente.usuario !== undefined
    );
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

export function getClienteNombreCompleto(cliente: ICliente): string {
    if (!cliente.usuario) return 'Cliente sin nombre';
    const nombre = cliente.usuario.nombre || '';
    const apellido = cliente.usuario.apellido || '';
    return `${nombre} ${apellido}`.trim() || 'Cliente sin nombre';
}

export function getClienteEmail(cliente: ICliente): string {
    return cliente.usuario?.email || 'Sin email';
}

export function getClienteTelefono(cliente: ICliente): string {
    return cliente.usuario?.telefono || cliente.telefono || '-';
}

