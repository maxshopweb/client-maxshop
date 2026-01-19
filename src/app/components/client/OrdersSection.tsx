"use client";

import ProfileCard from "./ProfileCard"; 
import OrdersSectionSkeleton from "./OrdersSectionSkeleton";
import PedidoCard from "./PedidoCard";
import { Package, ShoppingBag, XCircle } from "lucide-react";
import { useMyPedidos } from "@/app/hooks/clientes/useMyPedidos";
import { useAuth } from "@/app/context/AuthContext";
import type { IVenta } from "@/app/types/ventas.type";

export default function OrdersSection() {
  const { isAuthenticated, token } = useAuth();
  
  const { pedidos, isLoading, isError, error } = useMyPedidos({
    filters: {
      page: 1,
      limit: 10,
      order_by: 'fecha',
      order: 'desc',
    },
    enabled: isAuthenticated && !!token, // Solo ejecutar si está autenticado y tiene token
  });

  // Mostrar skeleton mientras carga
  if (isLoading) {
    return <OrdersSectionSkeleton />;
  }

  if (isError) {
    return (
      <ProfileCard title="Mis pedidos" icon={Package}>
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
      <ProfileCard title="Mis pedidos" icon={Package}>
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
    <ProfileCard title="Mis pedidos" icon={Package}>
      <div className="space-y-4">
        {pedidos.map((pedido: IVenta) => (
          <PedidoCard key={pedido.id_venta} pedido={pedido} />
        ))}
      </div>
    </ProfileCard>
  );
}

