"use client";

import ProfileCard from "./ProfileCard";
import { Package, ShoppingBag } from "lucide-react";

export default function OrdersSection() {
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

