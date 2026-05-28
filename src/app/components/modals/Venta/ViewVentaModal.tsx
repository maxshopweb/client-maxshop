import { useEffect, useState, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
    Package,
    User,
    Truck,
    CreditCard,
    ExternalLink,
    Search,
    MapPin,
    Phone,
    Mail,
    FileText,
    DollarSign,
    Calendar,
    Receipt,
    ShoppingBag,
} from 'lucide-react';
import type { IVenta, IDireccionVenta } from '@/app/types/ventas.type';
import { formatPrecio, formatFecha, getEstadoPagoColor, getEstadoEnvioColor } from '@/app/types/ventas.type';
import { ESTADO_PAGO_OPTIONS, ESTADO_ENVIO_OPTIONS, METODO_PAGO_OPTIONS, TIPO_VENTA_OPTIONS } from '@/app/types/ventas.type';
import ModalBase from '@/app/components/modals/BaseModal';
import ProductImage from '@/app/components/shared/ProductImage';
import { ventasService } from '@/app/services/venta.service';
import { getNumeroPedidoDisplay } from '@/app/utils/venta.utils';
import { getModoPagoDisplay } from '@/app/utils/paymentDisplay.utils';
interface ViewVentaModalProps {
    venta: IVenta;
    onClose: () => void;
    isOpen: boolean;
}
const DETAIL_CARD_CLASS = 'bg-card border border-card rounded-xl p-5 shadow-sm';
function DetailCard({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
    return (
        <div className={DETAIL_CARD_CLASS}>
            <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-lg bg-principal/10 shrink-0">
                    <Icon className="w-4 h-4 text-principal" aria-hidden />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            </div>
            {children}
        </div>
    );
}
/** 0 = eliminado, 1 = invitado, 2 = perfil incompleto, 3 = dado de alta */
function getTipoClienteLabel(estado: number | null | undefined): string {
    if (estado === 1) return 'Invitado';
    if (estado === 3) return 'Usuario registrado';
    if (estado === 2) return 'Perfil incompleto';
    return '-';
}
/** Dirección de facturación: desde direcciones (tipo facturacion) o cliente */
function getDireccionFacturacion(venta: IVenta): { direccion?: string; altura?: string; ciudad?: string; provincia?: string; cod_postal?: number; pais?: string } | null {
    const dirs = venta.direcciones;
    if (dirs?.length) {
        const fact = dirs.find((d: IDireccionVenta) => d.tipo === 'facturacion') || dirs[0];
        if (fact?.direccion || fact?.ciudad) {
            return {
                direccion: fact.direccion ?? undefined,
                altura: fact.altura ?? undefined,
                ciudad: fact.ciudad ?? undefined,
                provincia: fact.provincia ?? undefined,
                cod_postal: fact.cod_postal ?? undefined,
                pais: fact.pais ?? undefined,
            };
        }
    }
    const c = venta.cliente;
    if (c?.direccion || c?.ciudad) {
        return { direccion: c.direccion ?? undefined, altura: c.altura ?? undefined, ciudad: c.ciudad ?? undefined, provincia: c.provincia ?? undefined, cod_postal: c.cod_postal ?? undefined };
    }
    return null;
}
/** Dirección de envío: desde direcciones (tipo envio) o primera/cliente */
function getDireccionEnvio(venta: IVenta): { direccion?: string; altura?: string; piso?: string; dpto?: string; ciudad?: string; provincia?: string; cod_postal?: number } | null {
    const dirs = venta.direcciones;
    if (dirs?.length) {
        const env = dirs.find((d: IDireccionVenta) => d.tipo === 'envio' || d.tipo === 'entrega') || dirs[0];
        if (env?.direccion || env?.ciudad) {
            return {
                direccion: env.direccion ?? undefined,
                altura: env.altura ?? undefined,
                piso: env.piso ?? undefined,
                dpto: env.dpto ?? undefined,
                ciudad: env.ciudad ?? undefined,
                provincia: env.provincia ?? undefined,
                cod_postal: env.cod_postal ?? undefined,
            };
        }
    }
    const c = venta.cliente;
    if (c?.direccion || c?.ciudad) {
        return { direccion: c.direccion ?? undefined, altura: c.altura ?? undefined, piso: c.piso ?? undefined, dpto: c.dpto ?? undefined, ciudad: c.ciudad ?? undefined, provincia: c.provincia ?? undefined, cod_postal: c.cod_postal ?? undefined };
    }
    if (venta.envio?.direccion_envio) {
        return { direccion: venta.envio.direccion_envio ?? undefined };
    }
    return null;
}
const estadoBadgeClasses: Record<string, string> = {
    yellow: 'bg-yellow-500/15 text-yellow-700',
    green: 'bg-green-500/15 text-green-700',
    red: 'bg-red-500/15 text-red-700',
    blue: 'bg-blue-500/15 text-blue-700',
    purple: 'bg-purple-500/15 text-purple-700',
    indigo: 'bg-indigo-500/15 text-indigo-700',
    gray: 'bg-gray-500/15 text-gray-600',
};
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
    const tipoRaw = venta.tipo_venta as string | null | undefined;
    const tipoVentaKey = tipoRaw === 'telefono' ? 'otro' : venta.tipo_venta;
    const tipoVentaOption = TIPO_VENTA_OPTIONS.find(opt => opt.value === tipoVentaKey);
    const mpPayment = venta.mercado_pago_payments?.[0];
    const cliente = venta.cliente;
    const usuario = cliente?.usuario;
    const envio = venta.envio;
    const hasFacturaA = usuario?.tipo_documento === 'CUIT' || (usuario?.numero_documento && String(usuario.numero_documento).length >= 11);
    const dirFacturacion = getDireccionFacturacion(venta);
    const dirEnvio = getDireccionEnvio(venta);
    const hasDatosEnvio = dirEnvio || envio?.cod_seguimiento || envio?.empresa_envio || venta.observaciones;
    const referenciaPago = mpPayment?.payment_id ?? venta.referencia_pago_manual ?? null;
    const modoPagoLabel = getModoPagoDisplay(mpPayment, venta.metodo_pago);
    const metodoPagoDisplay = metodoPagoOption?.label || venta.metodo_pago || '-';
    const showModoPagoDetalle =
        modoPagoLabel !== '-' &&
        modoPagoLabel.trim().toLowerCase() !== metodoPagoDisplay.trim().toLowerCase();
    const numeroPedido = getNumeroPedidoDisplay(venta.cod_interno, venta.id_venta) ?? `#${venta.id_venta}`;
    const tipoVentaLabel = tipoVentaOption?.label || venta.tipo_venta || '-';
    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="max-w-4xl"
            showCloseButton={true}
            bodyScroll={false}
        >
            {({ handleClose }) => (
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden w-full">
                    <div className="px-6 pt-6 pb-5 bg-card border-b border-card shrink-0">
                        <div className="flex items-start gap-3 pr-8">
                            <div className="p-2.5 rounded-xl bg-principal/10 shrink-0">
                                <Receipt className="w-5 h-5 text-principal" aria-hidden />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm text-foreground/50 mb-0.5">Detalle de venta</p>
                                <h2 className="text-2xl font-bold text-foreground">{numeroPedido}</h2>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2 text-sm text-foreground/60">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden />
                                        {formatFecha(venta.fecha)}
                                    </span>

                                    <span className="inline-flex items-center gap-1.5">
                                        <ShoppingBag className="w-3.5 h-3.5 shrink-0" aria-hidden />
                                        {tipoVentaLabel}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${estadoBadgeClasses[estadoPagoColor] || estadoBadgeClasses.gray}`}>
                                        <CreditCard className="w-3 h-3 shrink-0" aria-hidden />
                                        {estadoPagoOption?.label || venta.estado_pago || '-'}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${estadoBadgeClasses[estadoEnvioColor] || estadoBadgeClasses.gray}`}>
                                        <Truck className="w-3 h-3 shrink-0" aria-hidden />
                                        {estadoEnvioOption?.label || venta.estado_envio || '-'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-muted/20 px-6 py-5 space-y-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-12 text-foreground/60">Cargando...</div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <DetailCard icon={User} title="Datos de cliente">
                                        {cliente?.usuario ? (
                                            <div className="space-y-2 text-sm">
                                                <p className="text-base font-semibold text-foreground">
                                                    {[usuario?.nombre, usuario?.apellido].filter(Boolean).join(' ') || 'Sin nombre'}
                                                </p>
                                                {usuario?.email && (
                                                    <div className="flex items-center gap-2 text-foreground/80 break-words">
                                                        <Mail className="w-3.5 h-3.5 shrink-0 text-foreground/40" aria-hidden />
                                                        <span>{usuario.email}</span>
                                                    </div>
                                                )}
                                                {(usuario?.telefono || (cliente as { telefono?: string })?.telefono) && (
                                                    <div className="flex items-center gap-2 text-foreground/80">
                                                        <Phone className="w-3.5 h-3.5 shrink-0 text-foreground/40" aria-hidden />
                                                        <span>{usuario?.telefono || (cliente as { telefono?: string })?.telefono}</span>
                                                        <span className="text-foreground/40 text-xs">/ WhatsApp</span>
                                                    </div>
                                                )}
                                                {(usuario?.tipo_documento || usuario?.numero_documento) && (
                                                    <p className="text-foreground">
                                                        <span className="text-foreground/60">DNI / CUIT: </span>
                                                        <span className="font-medium">
                                                            {[usuario?.tipo_documento, usuario?.numero_documento].filter(Boolean).join(' ') || '-'}
                                                        </span>
                                                        {hasFacturaA && (
                                                            <span className="ml-2 text-xs bg-blue-500/15 text-blue-600 px-1.5 py-0.5 rounded">Factura A</span>
                                                        )}
                                                    </p>
                                                )}
                                                <p className="text-foreground">
                                                    <span className="text-foreground/60">Tipo: </span>
                                                    <span className="font-medium">{getTipoClienteLabel(usuario?.estado as number | undefined)}</span>
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-foreground/40">Sin cliente asignado</p>
                                        )}
                                    </DetailCard>
                                    <DetailCard icon={FileText} title="Datos de facturación">
                                        {dirFacturacion ? (
                                            <div className="space-y-1.5 text-sm">
                                                {dirFacturacion.direccion && (
                                                    <p className="text-foreground">
                                                        <span className="text-foreground/60">Calle: </span>
                                                        {dirFacturacion.direccion}{dirFacturacion.altura ? ` ${dirFacturacion.altura}` : ''}
                                                    </p>
                                                )}
                                                {dirFacturacion.ciudad && (
                                                    <p className="text-foreground"><span className="text-foreground/60">Ciudad: </span>{dirFacturacion.ciudad}</p>
                                                )}
                                                {dirFacturacion.cod_postal != null && (
                                                    <p className="text-foreground"><span className="text-foreground/60">C.P.: </span>{dirFacturacion.cod_postal}</p>
                                                )}
                                                {dirFacturacion.provincia && (
                                                    <p className="text-foreground"><span className="text-foreground/60">Provincia: </span>{dirFacturacion.provincia}</p>
                                                )}
                                                {venta.referencia_facturacion && (
                                                    <div className="pt-1 space-y-0.5">
                                                        <p className="text-foreground/50 text-xs">Referencia / Comprobante</p>
                                                        <p className="font-mono text-foreground font-medium break-all">{venta.referencia_facturacion}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : venta.referencia_facturacion ? (
                                            <div className="space-y-1.5 text-sm">
                                                <p className="text-foreground/50 text-xs">Referencia / Comprobante</p>
                                                <p className="font-mono text-foreground font-medium break-all">{venta.referencia_facturacion}</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-foreground/40">Sin datos de facturación</p>
                                        )}
                                    </DetailCard>
                                    <DetailCard icon={MapPin} title="Datos de entrega">
                                        {hasDatosEnvio ? (
                                            <div className="space-y-1.5 text-sm">
                                                {dirEnvio?.direccion && (
                                                    <p className="text-foreground">
                                                        <span className="text-foreground/60">Calle: </span>
                                                        {dirEnvio.direccion}{dirEnvio.altura ? ` ${dirEnvio.altura}` : ''}
                                                    </p>
                                                )}
                                                {(dirEnvio?.piso || dirEnvio?.dpto) && (
                                                    <p className="text-foreground">
                                                        <span className="text-foreground/60">Piso / Dpto: </span>
                                                        {[dirEnvio.piso, dirEnvio.dpto].filter(Boolean).join(' ') || '-'}
                                                    </p>
                                                )}
                                                {dirEnvio?.ciudad && <p className="text-foreground"><span className="text-foreground/60">Ciudad: </span>{dirEnvio.ciudad}</p>}
                                                {dirEnvio?.provincia && <p className="text-foreground"><span className="text-foreground/60">Provincia: </span>{dirEnvio.provincia}</p>}
                                                {dirEnvio?.cod_postal != null && <p className="text-foreground"><span className="text-foreground/60">C.P.: </span>{dirEnvio.cod_postal}</p>}
                                                {!dirEnvio?.direccion && envio?.direccion_envio && (
                                                    <p className="text-foreground"><span className="text-foreground/60">Dirección: </span>{envio.direccion_envio}</p>
                                                )}
                                                {envio?.empresa_envio && (
                                                    <p className="text-foreground"><span className="text-foreground/60">Transporte: </span><span className="font-medium">{envio.empresa_envio}</span></p>
                                                )}
                                                {envio?.cod_seguimiento && (
                                                    <p className="text-foreground">
                                                        <span className="text-foreground/60">Nº de seguimiento: </span>
                                                        <span className="font-mono font-semibold break-all">{envio.cod_seguimiento}</span>
                                                    </p>
                                                )}
                                                {(envio?.consultaUrl || envio?.trackingUrl) && (
                                                    <div className="flex flex-wrap gap-3 pt-1">
                                                        {envio.consultaUrl && (
                                                            <a href={envio.consultaUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-principal hover:underline touch-manipulation">
                                                                <Search className="w-3.5 h-3.5" aria-hidden /> Consultar <ExternalLink className="w-3 h-3" aria-hidden />
                                                            </a>
                                                        )}
                                                        {envio.trackingUrl && (
                                                            <a href={envio.trackingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline touch-manipulation">
                                                                <Truck className="w-3.5 h-3.5" aria-hidden /> Tracking <ExternalLink className="w-3 h-3" aria-hidden />
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                                {(venta.observaciones || envio?.observaciones) && (
                                                    <div className="pt-1 space-y-0.5">
                                                        <p className="text-foreground/50 text-xs">Observaciones</p>
                                                        <p className="text-foreground whitespace-pre-wrap break-words">{venta.observaciones || envio?.observaciones}</p>
                                                    </div>
                                                )}
                                                {envio?.costo_envio != null && (
                                                    <p className="text-foreground"><span className="text-foreground/60">Costo envío: </span>{formatPrecio(envio.costo_envio)}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-foreground/40">Sin datos de entrega</p>
                                        )}
                                    </DetailCard>
                                    <DetailCard icon={CreditCard} title="Datos de pago">
                                        <div className="space-y-2 text-sm">
                                            <p className="text-base font-semibold text-foreground">{metodoPagoDisplay}</p>
                                            {showModoPagoDetalle && (
                                                <div className="space-y-0.5">
                                                    <p className="text-foreground/50 text-xs">Modo de pago</p>
                                                    <p className="text-foreground font-medium">{modoPagoLabel}</p>
                                                </div>
                                            )}
                                            <div className="space-y-0.5">
                                                <p className="text-foreground/50 text-xs">Referencia de pago</p>
                                                <p className="font-mono text-foreground font-semibold break-all">{referenciaPago || '-'}</p>
                                            </div>
                                        </div>
                                    </DetailCard>
                                </div>
                                <DetailCard icon={Package} title={`Productos (${venta.detalles?.length || 0})`}>
                                    {venta.detalles && venta.detalles.length > 0 ? (
                                        <div className="space-y-2">
                                            {venta.detalles.map((detalle, index) => (
                                                <div
                                                    key={detalle.id_detalle || index}
                                                    className="flex items-center gap-4 rounded-lg bg-muted/30 p-3"
                                                >
                                                    <div className="w-14 h-14 shrink-0 rounded-lg bg-background overflow-hidden">
                                                        <ProductImage
                                                            imgPrincipal={detalle.producto?.img_principal}
                                                            codiArti={detalle.producto?.codi_arti}
                                                            nombre={detalle.producto?.nombre}
                                                            size="sm"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-foreground truncate">
                                                            {detalle.producto?.nombre || 'Producto sin nombre'}
                                                        </p>
                                                        <p className="text-xs text-foreground/50 mt-0.5 truncate">
                                                            {[
                                                                detalle.producto?.codi_arti,
                                                                detalle.producto?.marca?.nombre,
                                                                detalle.producto?.modelo?.trim(),
                                                                `x${detalle.cantidad ?? 0}`,
                                                            ].filter(Boolean).join(' · ')}
                                                        </p>
                                                        {detalle.descuento_aplicado != null && detalle.descuento_aplicado > 0 && (
                                                            <p className="text-xs text-red-600 mt-0.5">
                                                                Descuento: -{formatPrecio(detalle.descuento_aplicado)}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="font-semibold text-foreground">{formatPrecio(detalle.sub_total)}</p>
                                                        <p className="text-xs text-foreground/50">{formatPrecio(detalle.precio_unitario)} c/u</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-center text-foreground/50 py-4">No hay productos en esta venta</p>
                                    )}
                                </DetailCard>
                                <div className={`${DETAIL_CARD_CLASS} max-w-md ml-auto w-full sm:w-auto`}>
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <div className="p-2 rounded-lg bg-principal/10 shrink-0">
                                            <DollarSign className="w-4 h-4 text-principal" aria-hidden />
                                        </div>
                                        <h3 className="text-sm font-semibold text-foreground">Resumen</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {venta.total_sin_iva != null && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-foreground/60">Subtotal (sin IVA)</span>
                                                <span className="font-medium text-foreground">{formatPrecio(venta.total_sin_iva)}</span>
                                            </div>
                                        )}
                                        {venta.total_con_iva != null && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-foreground/60">Total (con IVA)</span>
                                                <span className="font-medium text-foreground">{formatPrecio(venta.total_con_iva)}</span>
                                            </div>
                                        )}
                                        {venta.descuento_total != null && venta.descuento_total > 0 && (
                                            <div className="flex justify-between text-sm text-red-600">
                                                <span>Descuento total</span>
                                                <span className="font-medium">-{formatPrecio(venta.descuento_total)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-baseline pt-2">
                                            <span className="text-lg font-bold text-foreground">Total neto</span>
                                            <span className="text-2xl font-bold text-principal">{formatPrecio(venta.total_neto)}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex justify-end gap-3 px-6 py-4 bg-card border-t border-card shrink-0">
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
