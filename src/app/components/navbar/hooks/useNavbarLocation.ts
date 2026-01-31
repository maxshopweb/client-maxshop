"use client";

import { useState } from "react";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";

export function useNavbarLocation() {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  
  // Leer ubicación del store
  const ciudad = useCheckoutStore((state) => state.ciudad);
  const provincia = useCheckoutStore((state) => state.provincia);
  
  // Formatear localidad desde el store
  const localidad = ciudad && provincia 
    ? `${ciudad}, ${provincia}`
    : ciudad || provincia || "Córdoba";
  
  // Valores por defecto para compatibilidad (no se usan realmente)
  const selectedProvincia = provincia || "cordoba";
  const selectedCiudad = ciudad || "cordoba-capital";

  const handleLocationSelect = (provincia: string, ciudad: string, nombreCompleto: string) => {
    // El LocationModal ya guarda en el store, solo necesitamos el callback para compatibilidad
    // No hacer nada aquí, el store ya está actualizado
  };

  const openLocationModal = () => {
    setIsLocationModalOpen(true);
  };

  const closeLocationModal = () => {
    setIsLocationModalOpen(false);
  };

  return {
    localidad,
    selectedProvincia,
    selectedCiudad,
    isLocationModalOpen,
    openLocationModal,
    closeLocationModal,
    handleLocationSelect,
  };
}

