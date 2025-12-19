"use client";

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { useCliente, useClienteStats, useClienteVentas } from '@/app/hooks/clientes/useClientes';
import { getClienteNombreCompleto, getClienteEmail, formatFecha } from '@/app/types/cliente.type';
import Link from 'next/link';
import TableSkeleton from '@/app/components/skeletons/TableProductSkeleton';
import { formatPrecio } from '@/app/types/ventas.type';

export default function ClienteDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { cliente, isLoading: isLoadingCliente } = useCliente({ id });
    const { stats, isLoading: isLoadingStats } = useClienteStats({ id });
    const { ventas, pagination, isLoading: isLoadingVentas } = useClienteVentas(id, { limit: 10, page: 1 });

    if (isLoadingCliente) {
        return (
            <div className="space-y-6">
                <div className="bg-card border border-card p-8 rounded-2xl shadow-lg">
                    <TableSkeleton />
                </div>
            </div>
        );
    }

    if (!cliente) {
        return (
            <div className="space-y-6">
                <div className="bg-card border border-card p-8 rounded-2xl shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-text mb-4">Cliente no encontrado</h2>
                    <Button onClick={() => router.push('/admin/clientes')}>
                        Volver a Clientes
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-secundario p-6 rounded-2xl shadow-lg border border-principal/10 dark:border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/admin/clientes')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </Button>
                    <h1 className="text-2xl font-bold text-text">
                        Perfil del cliente
                    </h1>
                    <div className="w-24" /> {/* Spacer */}
                </div>

                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold text-text mb-2">
                                {getClienteNombreCompleto(cliente)}
                            </h2>
                            {cliente.usuario?.username && (
                                <p className="text-sm text-gray-500">@{cliente.usuario.username}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="text-text">{getClienteEmail(cliente)}</span>
                            </div>
                            {cliente.usuario?.telefono && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <span className="text-text">{cliente.usuario.telefono}</span>
                                </div>
                            )}
                            {(cliente.ciudad || cliente.provincia) && (
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span className="text-text">
                                        {cliente.ciudad || ''}
                                        {cliente.ciudad && cliente.provincia ? ', ' : ''}
                                        {cliente.provincia || ''}
                                    </span>
                                </div>
                            )}
                            {cliente.usuario?.creado_en && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-text">
                                        Registrado: {formatFecha(cliente.usuario.creado_en)}
                                    </span>
                                </div>
                            )}
                            {cliente.usuario?.ultimo_login && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-text">
                                        Último acceso: {formatFecha(cliente.usuario.ultimo_login)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Dirección completa */}
                    {cliente.direccion && (
                        <div className="space-y-2">
                            <h3 className="font-semibold text-text">Dirección</h3>
                            <p className="text-sm text-gray-600">{cliente.direccion}</p>
                            {cliente.cod_postal && (
                                <p className="text-sm text-gray-600">CP: {cliente.cod_postal}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Estadísticas */}
            {isLoadingStats ? (
                <div className="bg-card border border-card p-6 rounded-xl shadow">
                    <TableSkeleton />
                </div>
            ) : stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-card border border-card p-6 rounded-xl shadow">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">Total ventas</h3>
                        <p className="text-2xl font-bold text-principal">{stats.totalVentas || 0}</p>
                    </div>
                    <div className="bg-card border border-card p-6 rounded-xl shadow">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">Total gastado</h3>
                        <p className="text-2xl font-bold text-principal">
                            {formatPrecio(stats.totalGastado || 0)}
                        </p>
                    </div>
                    <div className="bg-card border border-card p-6 rounded-xl shadow">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">Promedio venta</h3>
                        <p className="text-2xl font-bold text-principal">
                            {formatPrecio(stats.promedioVenta || 0)}
                        </p>
                    </div>
                    <div className="bg-card border border-card p-6 rounded-xl shadow">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">Productos comprados</h3>
                        <p className="text-2xl font-bold text-principal">{stats.productosComprados || 0}</p>
                    </div>
                </div>
            )}

            {/* Historial de Ventas */}
            <div className="bg-white dark:bg-secundario p-6 rounded-2xl shadow-lg border border-principal/10 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-text">Historial de ventas</h2>
                    <Link
                        href={`/admin/ventas?cliente=${id}`}
                        className="text-sm text-principal hover:underline flex items-center gap-1"
                    >
                        Ver todas
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                </div>

                {isLoadingVentas ? (
                    <TableSkeleton />
                ) : ventas.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>Este cliente aún no tiene ventas registradas</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                        ID Venta
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                        Fecha
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                        Total
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                        Estado pago
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {ventas.map((venta: any) => (
                                    <tr key={venta.id_venta} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium">
                                            #{venta.id_venta}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {formatFecha(venta.fecha)}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold">
                                            {formatPrecio(venta.total_neto || 0)}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    venta.estado_pago === 'aprobado'
                                                        ? 'bg-green-100 text-green-800'
                                                        : venta.estado_pago === 'pendiente'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {venta.estado_pago || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <Link
                                                href={`/admin/ventas?highlight=${venta.id_venta}`}
                                                className="text-principal hover:underline flex items-center gap-1"
                                            >
                                                Ver
                                                <ExternalLink className="w-3 h-3" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

