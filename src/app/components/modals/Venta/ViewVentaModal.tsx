import { useEffect, useState } from 'react';
import { Package, DollarSign, User, Truck, CreditCard, ExternalLink, Search, MapPin, Phone, Mail } from 'lucide-react';
import type { IVenta } from '@/app/types/ventas.type';
import { formatPrecio, formatFecha, getEstadoPagoColor, getEstadoEnvioColor } from '@/app/types/ventas.type';
import { ESTADO_PAGO_OPTIONS, ESTADO_ENVIO_OPTIONS, METODO_PAGO_OPTIONS, TIPO_VENTA_OPTIONS } from '@/app/types/ventas.type';
import ModalBase from '@/app/components/modals/BaseModal';
import { ventasService } from '@/app/services/venta.service';
import { getNumeroPedidoDisplay } from '@/app/utils/venta.utils';

interface ViewVentaModalProps {
    venta: IVenta;
    onClose: () => void;
    isOpen: boolean;
}

/** 0 = eliminado, 1 = invitado, 2 = perfil incompleto, 3 = dado de alta */
function getTipoClienteLabel(estado: number | null | undefined): string {
    if (estado === 1) return 'Invitado';
    if (estado === 3) return 'Usuario registrado';
    if (estado === 2) return 'Perfil incompleto';
    return '-';
}

export function ViewVentaModal({ venta: ventaInitial, onClose, isOpen }: ViewVentaModalProps) {
    const [venta, setVenta] = useState<IVenta>(ventaInitial);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !ventaInitial?.id_venta) return;
        setVenta(ventaInitial);
        setLoading(true);
        ventasService
            .getById(ventaInitial.id_venta)
            .then((full) => setVenta(full))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [isOpen, ventaInitial?.id_venta]);

    const estadoPagoColor = getEstadoPagoColor(venta.estado_pago || 'pendiente');
    const estadoEnvioColor = getEstadoEnvioColor(venta.estado_envio || 'pendiente');
    const estadoPagoOption = ESTADO_PAGO_OPTIONS.find(opt => opt.value === venta.estado_pago);
    const estadoEnvioOption = ESTADO_ENVIO_OPTIONS.find(opt => opt.value === venta.estado_envio);
    const metodoPagoOption = METODO_PAGO_OPTIONS.find(opt => opt.value === venta.metodo_pago);
    const tipoVentaOption = TIPO_VENTA_OPTIONS.find(opt => opt.value === venta.tipo_venta);
    const mpPayment = venta.mercado_pago_payments?.[0];
    const cliente = venta.cliente;
    const usuario = cliente?.usuario;
    const envio = venta.envio;

    const colorClasses: Record<string, string> = {
        yellow: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
        green: "bg-green-500/20 text-green-600 border-green-500/30",
        red: "bg-red-500/20 text-red-600 border-red-500/30",
        blue: "bg-blue-500/20 text-blue-600 border-blue-500/30",
        purple: "bg-purple-500/20 text-purple-600 border-purple-500/30",
        indigo: "bg-indigo-500/20 text-indigo-600 border-indigo-500/30",
        gray: "bg-gray-500/20 text-gray-600 border-gray-500/30",
    };

    const hasFacturaA = usuario?.tipo_documento === 'CUIT' || (usuario?.numero_documento && String(usuario.numero_documento).length >= 11);
    const hasDatosEnvio = cliente?.direccion || cliente?.ciudad || envio?.direccion_envio || envio?.cod_seguimiento || venta.observaciones;

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
                                    Detalles de venta {getNumeroPedidoDisplay(venta.cod_interno, venta.id_venta) ?? `#${venta.id_venta}`}
                                </h2>
                                <p className="text-sm text-foreground/60 mt-1">
                                    {formatFecha(venta.fecha)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-12 text-foreground/60">Cargando...</div>
                        ) : (
                            <>
                                {/* Fila 1: Cliente | Datos de envío */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Bloque Cliente */}
                                    <div className="p-4 bg-background rounded-lg border border-input">
                                        <div className="flex items-center gap-2 mb-3">
                                            <User className="w-4 h-4 text-foreground/60" />
                                            <h3 className="text-sm font-semibold text-foreground/60 uppercase">Cliente</h3>
                                        </div>
                                        {cliente?.usuario ? (
                                            <div className="space-y-2 text-sm">
                                                <p className="text-base font-semibold text-foreground">
                                                    {[usuario?.nombre, usuario?.apellido].filter(Boolean).join(' ') || 'Sin nombre'}
                                                </p>
                                                {usuario?.email && (
                                                    <div className="flex items-center gap-2 text-foreground/80">
                                                        <Mail className="w-3.5 h-3.5 shrink-0" />
                                                        <span>{usuario.email}</span>
                                                    </div>
                                                )}
                                                {(usuario?.telefono || (cliente as { telefono?: string })?.telefono) && (
                                                    <div className="flex items-center gap-2 text-foreground/80">
                                                        <Phone className="w-3.5 h-3.5 shrink-0" />
                                                        <span>{usuario?.telefono || (cliente as { telefono?: string })?.telefono}</span>
                                                        <span className="text-foreground/50">/ WhatsApp</span>
                                                    </div>
                                                )}
                                                {(usuario?.tipo_documento || usuario?.numero_documento) && (
                                                    <div className="pt-1 border-t border-input/50">
                                                        <span className="text-foreground/60">DNI / CUIT: </span>
                                                        <span className="font-medium text-foreground">
                                                            {[usuario?.tipo_documento, usuario?.numero_documento].filter(Boolean).join(' ') || '-'}
                                                        </span>
                                                        {hasFacturaA && (
                                                            <span className="ml-2 text-xs bg-blue-500/15 text-blue-600 px-1.5 py-0.5 rounded">Factura A</span>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="pt-1 border-t border-input/50">
                                                    <span className="text-foreground/60">Tipo: </span>
                                                    <span className="font-medium text-foreground">
                                                        {getTipoClienteLabel(usuario?.estado as number | undefined)}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-foreground/40">Sin cliente asignado</p>
                                        )}
                                    </div>

                                    {/* Bloque Datos de envío (arriba, jerarquizado) */}
                                    <div className="p-4 bg-background rounded-lg border border-input">
                                        <div className="flex items-center gap-2 mb-3">
                                            <MapPin className="w-4 h-4 text-foreground/60" />
                                            <h3 className="text-sm font-semibold text-foreground/60 uppercase">Datos de envío</h3>
                                        </div>
                                        {hasDatosEnvio ? (
                                            <div className="space-y-1.5 text-sm">
                                                {cliente?.direccion && (
                                                    <p className="text-foreground"><span className="text-foreground/60">Calle: </span>{cliente.direccion}</p>
                                                )}
                                                {cliente?.altura && (
                                                    <p className="text-foreground"><span className="text-foreground/60">Número: </span>{cliente.altura}</p>
                                                )}
                                                {(cliente?.piso || cliente?.dpto) && (
                                                    <p className="text-foreground">
                                                        <span className="text-foreground/60">Piso / Dpto: </span>
                                                        {[cliente.piso, cliente.dpto].filter(Boolean).join(' ') || '-'}
                                                    </p>
                                                )}
                                                {cliente?.ciudad && (
                                                    <p className="text-foreground"><span className="text-foreground/60">Ciudad: </span>{cliente.ciudad}</p>
                                                )}
                                                {cliente?.provincia && (
                                                    <p className="text-foreground"><span className="text-foreground/60">Provincia: </span>{cliente.provincia}</p>
                                                )}
                                                {cliente?.cod_postal != null && (
                                                    <p className="text-foreground"><span className="text-foreground/60">Código postal: </span>{cliente.cod_postal}</p>
                                                )}
                                                {!cliente?.direccion && envio?.direccion_envio && (
                                                    <p className="text-foreground"><span className="text-foreground/60">Dirección: </span>{envio.direccion_envio}</p>
                                                )}
                                                {(venta.observaciones || envio?.observaciones) && (
                                                    <div className="pt-2 border-t border-input/50">
                                                        <p className="text-foreground/60 text-xs uppercase mb-0.5">Observaciones</p>
                                                        <p className="text-foreground whitespace-pre-wrap">{venta.observaciones || envio?.observaciones}</p>
                                                    </div>
                                                )}
                                                {envio?.cod_seguimiento && (
                                                    <div className="pt-2 border-t border-input/50 space-y-1">
                                                        <p className="text-foreground">
                                                            <span className="text-foreground/60">Nº etiqueta Andreani: </span>
                                                            <span className="font-mono font-semibold">{envio.cod_seguimiento}</span>
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {envio.consultaUrl && (
                                                                <a href={envio.consultaUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-principal/10 hover:bg-principal/20 text-principal rounded text-xs font-medium">
                                                                    <Search className="w-3 h-3" /> Consultar <ExternalLink className="w-3 h-3" />
                                                                </a>
                                                            )}
                                                            {envio.trackingUrl && (
                                                                <a href={envio.trackingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 rounded text-xs font-medium">
                                                                    <Truck className="w-3 h-3" /> Tracking <ExternalLink className="w-3 h-3" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                {envio?.costo_envio != null && (
                                                    <p className="text-foreground"><span className="text-foreground/60">Costo envío: </span>{formatPrecio(envio.costo_envio)}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-foreground/40">Sin datos de envío</p>
                                        )}
                                    </div>
                                </div>

                                {/* Fila 2: 3 columnas — Método de pago | Tipo de venta | Estados */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-background rounded-lg border border-input">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CreditCard className="w-4 h-4 text-foreground/60" />
                                            <h3 className="text-sm font-semibold text-foreground/60 uppercase">Método de pago</h3>
                                        </div>
                                        <p className="text-base font-semibold text-foreground capitalize">
                                            {metodoPagoOption?.label || venta.metodo_pago || '-'}
                                        </p>
                                        {venta.metodo_pago === 'mercadopago' && (mpPayment?.payment_id || !loading) && (
                                            <div className="mt-2 pt-2 border-t border-input/50">
                                                <p className="text-xs text-foreground/60 uppercase mb-0.5">Cód. transacción Mercado Pago</p>
                                                <p className="font-mono text-sm font-semibold text-foreground break-all">
                                                    {mpPayment?.payment_id || '-'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 bg-background rounded-lg border border-input">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Package className="w-4 h-4 text-foreground/60" />
                                            <h3 className="text-sm font-semibold text-foreground/60 uppercase">Tipo de venta</h3>
                                        </div>
                                        <p className="text-base font-semibold text-foreground">
                                            {tipoVentaOption?.label || venta.tipo_venta || '-'}
                                        </p>
                                    </div>
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
                                                                {detalle.producto?.codi_arti && <span>Código: {detalle.producto.codi_arti}</span>}
                                                                {detalle.producto?.modelo?.trim() && <span>Modelo: {detalle.producto.modelo.trim()}</span>}
                                                                {detalle.producto?.marca?.nombre && <span>Marca: {detalle.producto.marca.nombre}</span>}
                                                                {detalle.producto?.categoria?.nombre && <span>Categoría: {detalle.producto.categoria.nombre}</span>}
                                                            </div>
                                                        </div>
                                                        <div className="text-right space-y-1">
                                                            <div className="text-sm text-foreground/60">Cantidad: <span className="font-semibold text-foreground">{detalle.cantidad ?? 0}</span></div>
                                                            <div className="text-sm text-foreground/60">Precio unit.: <span className="font-semibold text-foreground">{formatPrecio(detalle.precio_unitario)}</span></div>
                                                            {detalle.descuento_aplicado && detalle.descuento_aplicado > 0 && (
                                                                <div className="text-sm text-red-600">Descuento: -{formatPrecio(detalle.descuento_aplicado)}</div>
                                                            )}
                                                            <div className="text-base font-bold text-principal mt-2">Subtotal: {formatPrecio(detalle.sub_total)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-6 text-center text-foreground/60">No hay productos en esta venta</div>
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
                                        {venta.total_sin_iva != null && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-foreground/60">Subtotal (sin IVA):</span>
                                                <span className="font-semibold text-foreground">{formatPrecio(venta.total_sin_iva)}</span>
                                            </div>
                                        )}
                                        {venta.total_con_iva != null && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-foreground/60">Total (con IVA):</span>
                                                <span className="font-semibold text-foreground">{formatPrecio(venta.total_con_iva)}</span>
                                            </div>
                                        )}
                                        {venta.descuento_total != null && venta.descuento_total > 0 && (
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
                            </>
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
