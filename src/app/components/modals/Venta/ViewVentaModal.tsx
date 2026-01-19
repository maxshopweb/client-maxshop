import { Package, DollarSign, User, Truck, CreditCard, FileText, ExternalLink, Search } from 'lucide-react';
import type { IVenta } from '@/app/types/ventas.type';
import { formatPrecio, formatFecha, getEstadoPagoColor, getEstadoEnvioColor } from '@/app/types/ventas.type';
import { ESTADO_PAGO_OPTIONS, ESTADO_ENVIO_OPTIONS, METODO_PAGO_OPTIONS, TIPO_VENTA_OPTIONS } from '@/app/types/ventas.type';
import ModalBase from '@/app/components/modals/BaseModal';

interface ViewVentaModalProps {
    venta: IVenta;
    onClose: () => void;
    isOpen: boolean;
}

export function ViewVentaModal({ venta, onClose, isOpen }: ViewVentaModalProps) {
    const estadoPagoColor = getEstadoPagoColor(venta.estado_pago || 'pendiente');
    const estadoEnvioColor = getEstadoEnvioColor(venta.estado_envio || 'pendiente');
    const estadoPagoOption = ESTADO_PAGO_OPTIONS.find(opt => opt.value === venta.estado_pago);
    const estadoEnvioOption = ESTADO_ENVIO_OPTIONS.find(opt => opt.value === venta.estado_envio);
    const metodoPagoOption = METODO_PAGO_OPTIONS.find(opt => opt.value === venta.metodo_pago);
    const tipoVentaOption = TIPO_VENTA_OPTIONS.find(opt => opt.value === venta.tipo_venta);

    const colorClasses: Record<string, string> = {
        yellow: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
        green: "bg-green-500/20 text-green-600 border-green-500/30",
        red: "bg-red-500/20 text-red-600 border-red-500/30",
        blue: "bg-blue-500/20 text-blue-600 border-blue-500/30",
        purple: "bg-purple-500/20 text-purple-600 border-purple-500/30",
        indigo: "bg-indigo-500/20 text-indigo-600 border-indigo-500/30",
        gray: "bg-gray-500/20 text-gray-600 border-gray-500/30",
    };

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="max-w-4xl"
            showCloseButton={true}
        >
            {({ handleClose }) => (
                <div className="w-full max-h-[90vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-input">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-principal/10 rounded-lg">
                                <Package className="w-6 h-6 text-principal" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">
                                    Detalles de venta #{venta.id_venta}
                                </h2>
                                <p className="text-sm text-foreground/60 mt-1">
                                    {formatFecha(venta.fecha)}
                                </p>
                            </div>
                        </div>
                    </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Información General */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Cliente */}
                        <div className="p-4 bg-background rounded-lg border border-input">
                            <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-foreground/60" />
                                <h3 className="text-sm font-semibold text-foreground/60 uppercase">Cliente</h3>
                            </div>
                            {venta.cliente?.usuario ? (
                                <div className="mt-2">
                                    <p className="text-base font-semibold text-foreground">
                                        {venta.cliente.usuario.nombre} {venta.cliente.usuario.apellido}
                                    </p>
                                    {venta.cliente.usuario.email && (
                                        <p className="text-sm text-foreground/60 mt-1">
                                            {venta.cliente.usuario.email}
                                        </p>
                                    )}
                                    {venta.cliente.usuario.telefono && (
                                        <p className="text-sm text-foreground/60 mt-1">
                                            {venta.cliente.usuario.telefono}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-foreground/40 mt-2">Sin cliente asignado</p>
                            )}
                        </div>

                        {/* Método de Pago */}
                        <div className="p-4 bg-background rounded-lg border border-input">
                            <div className="flex items-center gap-2 mb-2">
                                <CreditCard className="w-4 h-4 text-foreground/60" />
                                <h3 className="text-sm font-semibold text-foreground/60 uppercase">Método de pago</h3>
                            </div>
                            <p className="text-base font-semibold text-foreground mt-2 capitalize">
                                {metodoPagoOption?.label || venta.metodo_pago || '-'}
                            </p>
                        </div>

                        {/* Tipo de Venta */}
                        <div className="p-4 bg-background rounded-lg border border-input">
                            <div className="flex items-center gap-2 mb-2">
                                <Package className="w-4 h-4 text-foreground/60" />
                                <h3 className="text-sm font-semibold text-foreground/60 uppercase">Tipo de venta</h3>
                            </div>
                            <p className="text-base font-semibold text-foreground mt-2">
                                {tipoVentaOption?.label || venta.tipo_venta || '-'}
                            </p>
                        </div>

                        {/* Estados */}
                        <div className="p-4 bg-background rounded-lg border border-input">
                            <div className="flex items-center gap-2 mb-2">
                                <Truck className="w-4 h-4 text-foreground/60" />
                                <h3 className="text-sm font-semibold text-foreground/60 uppercase">Estados</h3>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${colorClasses[estadoPagoColor] || colorClasses.gray}`}>
                                    Pago: {estadoPagoOption?.label || venta.estado_pago || '-'}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${colorClasses[estadoEnvioColor] || colorClasses.gray}`}>
                                    Envío: {estadoEnvioOption?.label || venta.estado_envio || '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Productos */}
                    <div className="border border-input rounded-lg overflow-hidden">
                        <div className="bg-background px-6 py-4 border-b border-input">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Productos ({venta.detalles?.length || 0})
                            </h3>
                        </div>
                        <div className="divide-y divide-input">
                            {venta.detalles && venta.detalles.length > 0 ? (
                                venta.detalles.map((detalle, index) => (
                                    <div key={detalle.id_detalle || index} className="p-6 hover:bg-background/50 transition-colors">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h4 className="text-base font-semibold text-foreground mb-1">
                                                    {detalle.producto?.nombre || 'Producto sin nombre'}
                                                </h4>
                                                <div className="flex flex-wrap gap-4 text-sm text-foreground/60 mt-2">
                                                    {detalle.producto?.codi_arti && (
                                                        <span>Código: {detalle.producto.codi_arti}</span>
                                                    )}
                                                    {detalle.producto?.marca?.nombre && (
                                                        <span>Marca: {detalle.producto.marca.nombre}</span>
                                                    )}
                                                    {detalle.producto?.categoria?.nombre && (
                                                        <span>Categoría: {detalle.producto.categoria.nombre}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <div className="text-sm text-foreground/60">
                                                    Cantidad: <span className="font-semibold text-foreground">{detalle.cantidad || 0}</span>
                                                </div>
                                                <div className="text-sm text-foreground/60">
                                                    Precio unitario: <span className="font-semibold text-foreground">{formatPrecio(detalle.precio_unitario)}</span>
                                                </div>
                                                {detalle.descuento_aplicado && detalle.descuento_aplicado > 0 && (
                                                    <div className="text-sm text-red-600">
                                                        Descuento: -{formatPrecio(detalle.descuento_aplicado)}
                                                    </div>
                                                )}
                                                <div className="text-base font-bold text-principal mt-2">
                                                    Subtotal: {formatPrecio(detalle.sub_total)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-foreground/60">
                                    No hay productos en esta venta
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Totales */}
                    <div className="bg-principal/10 border border-principal/30 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5" />
                            Resumen financiero
                        </h3>
                        <div className="space-y-2">
                            {venta.total_sin_iva !== null && venta.total_sin_iva !== undefined && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-foreground/60">Subtotal (sin IVA):</span>
                                    <span className="font-semibold text-foreground">{formatPrecio(venta.total_sin_iva)}</span>
                                </div>
                            )}
                            {venta.total_con_iva !== null && venta.total_con_iva !== undefined && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-foreground/60">Total (con IVA):</span>
                                    <span className="font-semibold text-foreground">{formatPrecio(venta.total_con_iva)}</span>
                                </div>
                            )}
                            {venta.descuento_total !== null && venta.descuento_total !== undefined && venta.descuento_total > 0 && (
                                <div className="flex justify-between text-sm text-red-600">
                                    <span>Descuento total:</span>
                                    <span className="font-semibold">-{formatPrecio(venta.descuento_total)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg pt-2 border-t border-principal/30">
                                <span className="font-bold text-foreground">Total neto:</span>
                                <span className="font-bold text-principal text-xl">{formatPrecio(venta.total_neto)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Observaciones */}
                    {venta.observaciones && (
                        <div className="p-4 bg-background rounded-lg border border-input">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-foreground/60" />
                                <h3 className="text-sm font-semibold text-foreground/60 uppercase">Observaciones</h3>
                            </div>
                            <p className="text-sm text-foreground mt-2 whitespace-pre-wrap">
                                {venta.observaciones}
                            </p>
                        </div>
                    )}

                    {/* Información de Envío */}
                    {venta.envio && (
                        <div className="p-4 bg-background rounded-lg border border-input">
                            <div className="flex items-center gap-2 mb-2">
                                <Truck className="w-4 h-4 text-foreground/60" />
                                <h3 className="text-sm font-semibold text-foreground/60 uppercase">Información de envío</h3>
                            </div>
                            <div className="mt-2 space-y-2 text-sm">
                                {venta.envio.empresa_envio && (
                                    <p className="text-foreground">
                                        <span className="text-foreground/60">Empresa: </span>
                                        {venta.envio.empresa_envio}
                                    </p>
                                )}
                                {venta.envio.estado_envio && (
                                    <p className="text-foreground">
                                        <span className="text-foreground/60">Estado del envío: </span>
                                        <span className={`font-medium capitalize ${getEstadoEnvioColor(venta.envio.estado_envio) === 'green' ? 'text-green-600' : getEstadoEnvioColor(venta.envio.estado_envio) === 'yellow' ? 'text-yellow-600' : 'text-foreground'}`}>
                                            {venta.envio.estado_envio.replace('_', ' ')}
                                        </span>
                                    </p>
                                )}
                                {venta.envio.cod_seguimiento && (
                                    <div className="space-y-1">
                                        <p className="text-foreground">
                                            <span className="text-foreground/60">Código de seguimiento: </span>
                                            <span className="font-mono font-semibold">{venta.envio.cod_seguimiento}</span>
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {venta.envio.consultaUrl && (
                                                <a
                                                    href={venta.envio.consultaUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-principal/10 hover:bg-principal/20 text-principal rounded-md text-xs font-medium transition-colors"
                                                >
                                                    <Search className="w-3.5 h-3.5" />
                                                    Consultar Estado
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                            {venta.envio.trackingUrl && (
                                                <a
                                                    href={venta.envio.trackingUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 rounded-md text-xs font-medium transition-colors"
                                                >
                                                    <Truck className="w-3.5 h-3.5" />
                                                    Ver Tracking
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {venta.envio.direccion_envio && (
                                    <p className="text-foreground">
                                        <span className="text-foreground/60">Dirección: </span>
                                        {venta.envio.direccion_envio}
                                    </p>
                                )}
                                {venta.envio.costo_envio !== null && venta.envio.costo_envio !== undefined && (
                                    <p className="text-foreground">
                                        <span className="text-foreground/60">Costo de envío: </span>
                                        {formatPrecio(venta.envio.costo_envio)}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 p-6 border-t border-input">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 bg-input hover:bg-input/80 rounded-lg text-foreground font-medium transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </ModalBase>
    );
}

