"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Clock, ExternalLink, Home, MapPinned, ShoppingCart, DollarSign, TrendingUp, Package, Edit3, FileText, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { useCliente, useClienteStats, useClienteVentas, useUpdateCliente } from '@/app/hooks/clientes/useClientes';
import { getClienteNombreCompleto, getClienteEmail, formatFecha } from '@/app/types/cliente.type';
import Link from 'next/link';
import TableSkeleton from '@/app/components/skeletons/TableProductSkeleton';
import { formatPrecio } from '@/app/types/ventas.type';
import { AnimatedStatCard } from '@/app/components/ui/AnimatedStatCard';
import { TableBadge } from '@/app/components/ui/TableBadge';
import { AdminPageContainer } from '@/app/components/Admin/AdminPageContainer';
import { getNumeroPedidoDisplay } from '@/app/utils/venta.utils';
import { EditClienteModal } from '@/app/components/modals/Cliente/EditClienteModal';

export default function ClienteDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = params.id as string;
    const [editModalOpen, setEditModalOpen] = useState(false);

    const { cliente, isLoading: isLoadingCliente, refetch: refetchCliente } = useCliente({ id });
    const { stats, isLoading: isLoadingStats } = useClienteStats({ id });
    const { ventas, pagination, isLoading: isLoadingVentas } = useClienteVentas(id, { limit: 10, page: 1 });
    const { updateClienteAsync, isUpdating } = useUpdateCliente();

    useEffect(() => {
        if (searchParams.get('edit') === '1') setEditModalOpen(true);
    }, [searchParams]);

    if (isLoadingCliente) {
        return (
            <AdminPageContainer>
                <div className="bg-card border border-card p-8 rounded-2xl shadow-lg">
                    <TableSkeleton />
                </div>
            </AdminPageContainer>
        );
    }

    if (!cliente) {
        return (
            <AdminPageContainer>
                <div className="bg-card border border-card p-8 rounded-2xl shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-text mb-4">Cliente no encontrado</h2>
                    <Button onClick={() => router.push('/admin/clientes')}>
                        Volver a Clientes
                    </Button>
                </div>
            </AdminPageContainer>
        );
    }

    return (
        <AdminPageContainer>
            {/* Header */}
            <div className="bg-white dark:bg-secundario p-6 rounded-2xl shadow-lg border border-principal/10 dark:border-white/10">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/admin/clientes')}
                            className="flex items-center gap-2 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver
                        </Button>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold text-text">
                                Perfil del cliente
                            </h1>
                            <TableBadge variant={cliente.usuario?.activo !== false ? 'success' : 'warning'}>
                                {cliente.usuario?.activo !== false ? 'Activo' : 'Inactivo'}
                            </TableBadge>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button
                            variant="outline-primary"
                            onClick={() => updateClienteAsync({ id, data: { activo: cliente.usuario?.activo === false } })}
                            disabled={isUpdating}
                            className="flex items-center gap-2"
                        >
                            {cliente.usuario?.activo !== false ? (
                                <>
                                    <UserX className="h-4 w-4 shrink-0" aria-hidden />
                                    Desactivar
                                </>
                            ) : (
                                <>
                                    <UserCheck className="h-4 w-4 shrink-0" aria-hidden />
                                    Activar
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline-primary"
                            onClick={() => setEditModalOpen(true)}
                            className="flex items-center gap-2"
                        >
                            <Edit3 className="h-4 w-4" aria-hidden />
                            Editar datos
                        </Button>
                    </div>
                </div>

                {/* Información básica */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-text mb-1">
                            {getClienteNombreCompleto(cliente)}
                        </h2>
                        {cliente.usuario?.username && (
                            <p className="text-sm text-gray-500">@{cliente.usuario.username}</p>
                        )}
                    </div>

                    {/* Primera fila: Contacto y Dirección */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Columna izquierda - Contacto */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-text mb-3">Información de contacto</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <span className="text-text">{getClienteEmail(cliente)}</span>
                                </div>
                                {cliente.usuario?.telefono && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                        <span className="text-text">{cliente.usuario.telefono}</span>
                                    </div>
                                )}
                                {(cliente.usuario?.numero_documento || cliente.usuario?.tipo_documento) && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                        <span className="text-text">
                                            {cliente.usuario.tipo_documento ? `${cliente.usuario.tipo_documento} ` : ''}
                                            {cliente.usuario.numero_documento || ''}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Columna derecha - Dirección */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-text mb-3">Dirección</h3>
                            <div className="space-y-2 text-sm">
                                {cliente.direccion && (
                                    <div className="flex items-start gap-2 text-text">
                                        <Home className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                        <span>
                                            {cliente.direccion}
                                            {cliente.altura && ` ${cliente.altura}`}
                                            {(cliente.piso || cliente.dpto) && (
                                                <span>
                                                    {cliente.piso && `, Piso ${cliente.piso}`}
                                                    {cliente.dpto && ` Depto ${cliente.dpto}`}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                )}
                                {(cliente.ciudad || cliente.provincia || cliente.cod_postal) && (
                                    <div className="flex items-start gap-2 text-text">
                                        <MapPinned className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                        <span>
                                            {cliente.ciudad && cliente.provincia
                                                ? `${cliente.ciudad}, ${cliente.provincia}`
                                                : cliente.ciudad || cliente.provincia || ''}
                                            {cliente.cod_postal && ` (CP: ${cliente.cod_postal})`}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Segunda fila: Fechas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                        {cliente.usuario?.creado_en && (
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <div>
                                    <div className="font-semibold text-text mb-1">Fecha de registro</div>
                                    <div className="text-text">{formatFecha(cliente.usuario.creado_en)}</div>
                                </div>
                            </div>
                        )}
                        {cliente.usuario?.ultimo_login && (
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <div>
                                    <div className="font-semibold text-text mb-1">Último acceso</div>
                                    <div className="text-text">{formatFecha(cliente.usuario.ultimo_login)}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {editModalOpen && (
                <EditClienteModal
                    cliente={cliente}
                    onClose={() => {
                        setEditModalOpen(false);
                        refetchCliente();
                    }}
                />
            )}

            {/* Estadísticas */}
            {isLoadingStats ? (
                <div className="bg-card border border-card p-6 rounded-xl shadow">
                    <TableSkeleton />
                </div>
            ) : stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <AnimatedStatCard
                        title="Total ventas"
                        value={stats.totalVentas || 0}
                        icon={ShoppingCart}
                        iconColor="text-blue-500"
                    />
                    <AnimatedStatCard
                        title="Total gastado"
                        value={stats.totalGastado || 0}
                        icon={DollarSign}
                        iconColor="text-green-500"
                        formatValue={(val) => formatPrecio(val)}
                    />
                    <AnimatedStatCard
                        title="Promedio venta"
                        value={stats.promedioVenta || 0}
                        icon={TrendingUp}
                        iconColor="text-purple-500"
                        formatValue={(val) => formatPrecio(val)}
                    />
                    <AnimatedStatCard
                        title="Productos comprados"
                        value={stats.productosComprados || 0}
                        icon={Package}
                        iconColor="text-orange-500"
                    />
                </div>
            )}

            {/* Historial de Ventas */}
            <div className="bg-white dark:bg-secundario p-6 rounded-2xl shadow-lg border border-principal/10 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-text">Historial de ventas</h2>
                    <Link
                        href={`/admin/ventas?page=1&limit=25&order_by=fecha&order=desc&busqueda=${id}`}
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
                                        <td className="px-4 py-3 text-sm font-medium font-mono">
                                            {getNumeroPedidoDisplay(venta.cod_interno, venta.id_venta) ?? `#${venta.id_venta}`}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {formatFecha(venta.fecha)}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold">
                                            {formatPrecio(venta.total_neto || 0)}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <TableBadge kind="estado_pago" value={venta.estado_pago} />
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <Link
                                                href={`/admin/ventas?page=1&limit=25&order_by=fecha&order=desc&highlight=${venta.id_venta}`}
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
        </AdminPageContainer>
    );
}

