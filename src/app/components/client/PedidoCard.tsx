"use client";

import { useState } from "react";
import { Calendar, CheckCircle2, Clock, XCircle, Truck, ExternalLink, Search, Receipt, ChevronDown, ChevronUp } from "lucide-react";
import { formatPrecio, formatFecha, getEstadoPagoColor, getEstadoEnvioColor } from "@/app/types/ventas.type";
import type { IVenta } from "@/app/types/ventas.type";
import { Button } from "@/app/components/ui/Button";

export default function PedidoCard({ pedido }: { pedido: IVenta }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const estadoPagoColor = getEstadoPagoColor(pedido.estado_pago || 'pendiente');
  const estadoEnvioColor = getEstadoEnvioColor(pedido.estado_envio || 'pendiente');

  return (
    <div className="border border-input rounded-lg p-4 sm:p-6 hover:border-primary/50 transition-colors">
      {/* Header del pedido */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-foreground">
              Pedido #{pedido.id_venta}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <Calendar className="w-4 h-4" />
            <span>{formatFecha(pedido.fecha)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-foreground">
            {formatPrecio(pedido.total_neto)}
          </span>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            size="sm"
            className="p-2"
            title={isExpanded ? "Minimizar" : "Expandir"}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-foreground/60" />
            ) : (
              <ChevronDown className="w-4 h-4 text-foreground/60" />
            )}
          </Button>
        </div>
      </div>

      {/* Estados - Siempre visibles */}
      <div className="flex flex-wrap gap-3 my-4">
        <EstadoBadge
          label="Pago"
          estado={pedido.estado_pago || 'pendiente'}
          color={estadoPagoColor}
        />
        <EstadoBadge
          label="Envío"
          estado={pedido.estado_envio || 'pendiente'}
          color={estadoEnvioColor}
        />
      </div>

      {/* Contenido expandible */}
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {/* Desglose de precios */}
        <PrecioDesglose pedido={pedido} />

        {/* Productos */}
        {pedido.detalles && pedido.detalles.length > 0 && (
          <div className="border-t border-input pt-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Productos ({pedido.detalles.length})
            </h4>
            <div className="space-y-2">
              {pedido.detalles.map((detalle) => (
                <div
                  key={detalle.id_detalle}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex-1">
                    <span className="text-foreground font-medium">
                      {detalle.producto?.nombre || 'Producto sin nombre'}
                    </span>
                    <span className="text-foreground/60 ml-2">
                      x{detalle.cantidad}
                    </span>
                  </div>
                  <span className="text-foreground font-medium">
                    {formatPrecio(detalle.sub_total)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Método de pago */}
        {pedido.metodo_pago && (
          <div className="mt-4 pt-4 border-t border-input">
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <span>Método de pago:</span>
              <span className="font-medium text-foreground capitalize">
                {pedido.metodo_pago.replace('_', ' ')}
              </span>
            </div>
          </div>
        )}

        {/* Información de Envío */}
        {pedido.envio && (
          <div className="mt-4 pt-4 border-t border-input">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-4 h-4 text-foreground/60" />
              <h4 className="text-sm font-semibold text-foreground">Información de envío</h4>
            </div>
            <div className="space-y-2 text-sm">
              {pedido.envio.empresa_envio && (
                <p className="text-foreground/60">
                  <span className="text-foreground/60">Empresa: </span>
                  <span className="text-foreground capitalize">{pedido.envio.empresa_envio}</span>
                </p>
              )}
              {pedido.envio.estado_envio && (
                <p className="text-foreground/60">
                  <span className="text-foreground/60">Estado: </span>
                  <span className={`font-medium capitalize ${getEstadoEnvioColor(pedido.envio.estado_envio) === 'green' ? 'text-green-600' : getEstadoEnvioColor(pedido.envio.estado_envio) === 'yellow' ? 'text-yellow-600' : getEstadoEnvioColor(pedido.envio.estado_envio) === 'red' ? 'text-red-600' : 'text-foreground'}`}>
                    {pedido.envio.estado_envio.replace('_', ' ')}
                  </span>
                </p>
              )}
              {(pedido.envio.cod_seguimiento || pedido.envio.codigoTracking || pedido.envio.numeroSeguimiento) && (
                <div className="space-y-2">
                  <p className="text-foreground/60">
                    <span className="text-foreground/60">Código de seguimiento: </span>
                    <span className="font-mono font-semibold text-foreground">
                      {pedido.envio.codigoTracking || pedido.envio.numeroSeguimiento || pedido.envio.cod_seguimiento}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pedido.envio.preEnvioUrl && (
                      <a
                        href={pedido.envio.preEnvioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 rounded-md text-xs font-medium transition-colors"
                      >
                        <Search className="w-3 h-3" />
                        Pre-envío
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {pedido.envio.envioUrl && (
                      <a
                        href={pedido.envio.envioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 rounded-md text-xs font-medium transition-colors"
                      >
                        <Truck className="w-3 h-3" />
                        Estado envío
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {pedido.envio.trazasUrl && (
                      <a
                        href={pedido.envio.trazasUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-600 rounded-md text-xs font-medium transition-colors"
                      >
                        <Truck className="w-3 h-3" />
                        Trazas
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {/* URLs legacy por compatibilidad */}
                    {pedido.envio.consultaUrl && !pedido.envio.preEnvioUrl && (
                      <a
                        href={pedido.envio.consultaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-principal/10 hover:bg-principal/20 text-principal rounded-md text-xs font-medium transition-colors"
                      >
                        <Search className="w-3 h-3" />
                        Consultar
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {pedido.envio.trackingUrl && !pedido.envio.envioUrl && (
                      <a
                        href={pedido.envio.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 rounded-md text-xs font-medium transition-colors"
                      >
                        <Truck className="w-3 h-3" />
                        Tracking
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PrecioDesglose({ pedido }: { pedido: IVenta }) {
  // Calcular subtotal de productos
  const subtotalProductos = pedido.detalles?.reduce((sum, detalle) => {
    return sum + (detalle.sub_total || 0);
  }, 0) || 0;

  // Usar total_sin_iva si está disponible, sino calcular desde subtotal
  const subtotal = pedido.total_sin_iva ?? subtotalProductos;

  // Calcular IVA
  const iva = pedido.total_con_iva && pedido.total_sin_iva
    ? pedido.total_con_iva - pedido.total_sin_iva
    : null;

  // Costo de envío
  const costoEnvio = pedido.envio?.costo_envio || 0;

  // Descuentos
  const descuentos = pedido.descuento_total || 0;

  // Total (ya está en total_neto)
  const total = pedido.total_neto || 0;

  // Verificar si hay información relevante para mostrar
  const tieneEnvio = costoEnvio > 0;
  const tieneIva = iva !== null && iva > 0;
  const tieneDescuentos = descuentos > 0;

  if (!tieneEnvio && !tieneIva && !tieneDescuentos && subtotal === total) {
    // Si no hay desglose necesario, no mostrar nada
    return null;
  }

  return (
    <div className="border-t border-input pt-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Receipt className="w-4 h-4 text-foreground/60" />
        <h4 className="text-sm font-semibold text-foreground">Desglose de precio</h4>
      </div>
      <div className="space-y-2 text-sm">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-foreground/60">Subtotal productos</span>
          <span className="text-foreground font-medium">{formatPrecio(subtotal)}</span>
        </div>

        {/* Descuentos */}
        {tieneDescuentos && (
          <div className="flex items-center justify-between">
            <span className="text-foreground/60">Descuentos</span>
            <span className="text-foreground font-medium text-green-600">
              -{formatPrecio(descuentos)}
            </span>
          </div>
        )}

        {/* Costo de envío - DESTACADO */}
        {tieneEnvio && (
          <div className="flex items-center justify-between py-1.5 px-2 bg-blue-500/10 rounded-md border border-blue-500/20">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span className="text-foreground font-semibold">Costo de envío</span>
            </div>
            <span className="text-blue-600 font-bold">{formatPrecio(costoEnvio)}</span>
          </div>
        )}

        {/* IVA - DESTACADO */}
        {tieneIva && (
          <div className="flex items-center justify-between py-1.5 px-2 bg-purple-500/10 rounded-md border border-purple-500/20">
            <span className="text-foreground font-semibold">IVA (21%)</span>
            <span className="text-purple-600 font-bold">{formatPrecio(iva)}</span>
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-input">
          <span className="text-base font-bold text-foreground">Total</span>
          <span className="text-lg font-bold text-primary">{formatPrecio(total)}</span>
        </div>
      </div>
    </div>
  );
}

function EstadoBadge({
  label,
  estado,
  color,
}: {
  label: string;
  estado: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    yellow: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
    green: "bg-green-500/20 text-green-600 border-green-500/30",
    red: "bg-red-500/20 text-red-600 border-red-500/30",
    blue: "bg-blue-500/20 text-blue-600 border-blue-500/30",
    purple: "bg-purple-500/20 text-purple-600 border-purple-500/30",
    indigo: "bg-indigo-500/20 text-indigo-600 border-indigo-500/30",
    gray: "bg-gray-500/20 text-gray-600 border-gray-500/30",
  };

  const iconMap: Record<string, React.ReactNode> = {
    aprobado: <CheckCircle2 className="w-3 h-3" />,
    entregado: <CheckCircle2 className="w-3 h-3" />,
    pendiente: <Clock className="w-3 h-3" />,
    cancelado: <XCircle className="w-3 h-3" />,
  };

  const icon = iconMap[estado.toLowerCase()] || null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
        colorClasses[color] || colorClasses.gray
      }`}
    >
      {icon}
      <span>{label}:</span>
      <span className="capitalize">{estado.replace('_', ' ')}</span>
    </div>
  );
}

