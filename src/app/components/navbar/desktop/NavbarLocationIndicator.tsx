"use client";

import { MapPin } from "lucide-react";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";

interface NavbarLocationIndicatorProps {
  shouldShowBackground: boolean;
  actualTheme: "light" | "dark";
  onLocationClick: () => void;
}

export default function NavbarLocationIndicator({
  shouldShowBackground,
  actualTheme,
  onLocationClick,
}: NavbarLocationIndicatorProps) {
  const ciudad = useCheckoutStore((state) => state.ciudad);
  const provincia = useCheckoutStore((state) => state.provincia);
  
  // Formatear localidad desde el store
  const localidad = ciudad && provincia 
    ? `${ciudad}, ${provincia}`
    : ciudad || provincia || "Seleccionar ubicación";

  const iconClassName = shouldShowBackground
    ? actualTheme === 'dark'
      ? "text-white"
      : "text-terciario"
    : "text-white";

  const textClassName = shouldShowBackground
    ? actualTheme === 'dark'
      ? "text-white"
      : "text-terciario"
    : "text-white";

  const mostrarLocalidad = localidad !== "Seleccionar ubicación";

  return (
    <button
      onClick={onLocationClick}
      className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity cursor-pointer"
    >
      <MapPin size={16} className={iconClassName} />
      <span className={textClassName}>
        {
          mostrarLocalidad ? `Estás en: ${localidad}` : "Seleccionar ubicación"
        }
      </span>
    </button>
  );
}

