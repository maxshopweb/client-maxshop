"use client";

import { MapPin } from "lucide-react";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";

interface NavbarLocationIndicatorProps {
  onLocationClick: () => void;
}

export default function NavbarLocationIndicator({
  onLocationClick,
}: NavbarLocationIndicatorProps) {
  const ciudad = useCheckoutStore((state) => state.ciudad);
  const provincia = useCheckoutStore((state) => state.provincia);
  
  // Formatear localidad desde el store
  const localidad = ciudad && provincia 
    ? `${ciudad}, ${provincia}`
    : ciudad || provincia || "Seleccionar ubicación";

  const mostrarLocalidad = localidad !== "Seleccionar ubicación";

  return (
    <button
      onClick={onLocationClick}
      className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity cursor-pointer"
    >
      <MapPin size={16} className="text-white" />
      <span className="text-white">
        {
          mostrarLocalidad ? `Estás en: ${localidad}` : "Seleccionar ubicación"
        }
      </span>
    </button>
  );
}

