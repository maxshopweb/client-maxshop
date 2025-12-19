"use client";

import ProfileCard from "./ProfileCard";
import { Package, ShoppingBag, Calendar, DollarSign, Truck, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useMyPedidos } from "@/app/hooks/clientes/useMyPedidos";
import { formatPrecio, formatFecha, getEstadoPagoColor, getEstadoEnvioColor } from "@/app/types/ventas.type";
import type { IVenta } from "@/app/types/ventas.type";

export default function OrdersSection() {
  const { pedidos, isLoading, isError, error } = useMyPedidos({
    filters: {
      page: 1,
      limit: 10,
      order_by: 'fecha',
      order: 'desc',
    },
  });

  if (isLoading) {
    return (
      <ProfileCard title="Mis Pedidos" icon={Package}>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-background rounded-lg"></div>
            </div>
          ))}
        </div>
      </ProfileCard>
    );
  }

  if (isError) {
    return (
      <ProfileCard title="Mis Pedidos" icon={Package}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Error al cargar pedidos
          </h3>
          <p className="text-sm text-foreground/60">
            {error?.message || "Ocurrió un error al cargar tus pedidos"}
          </p>
        </div>
      </ProfileCard>
    );
  }

  if (pedidos.length === 0) {
    return (
      <ProfileCard title="Mis Pedidos" icon={Package}>
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-background rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-foreground/30" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
            Aún no tienes pedidos
          </h3>
          <p className="text-sm sm:text-base text-foreground/60 max-w-md mx-auto px-4">
            Cuando realices tu primera compra, aquí podrás ver el historial de todos tus pedidos y su estado.
          </p>
        </div>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard title="Mis Pedidos" icon={Package}>
      <div className="space-y-4">
        {pedidos.map((pedido: IVenta) => (
          <PedidoCard key={pedido.id_venta} pedido={pedido} />
        ))}
      </div>
    </ProfileCard>
  );
}

function PedidoCard({ pedido }: { pedido: IVenta }) {
  const estadoPagoColor = getEstadoPagoColor(pedido.estado_pago || 'pendiente');
  const estadoEnvioColor = getEstadoEnvioColor(pedido.estado_envio || 'pendiente');

  return (
    <div className="border border-border rounded-lg p-4 sm:p-6 hover:border-primary/50 transition-colors">
      {/* Header del pedido */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
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
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          <span className="text-xl font-bold text-foreground">
            {formatPrecio(pedido.total_neto)}
          </span>
        </div>
      </div>

      {/* Estados */}
      <div className="flex flex-wrap gap-3 mb-4">
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

      {/* Productos */}
      {pedido.detalles && pedido.detalles.length > 0 && (
        <div className="border-t border-border pt-4">
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
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <span>Método de pago:</span>
            <span className="font-medium text-foreground capitalize">
              {pedido.metodo_pago.replace('_', ' ')}
            </span>
          </div>
        </div>
      )}
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

