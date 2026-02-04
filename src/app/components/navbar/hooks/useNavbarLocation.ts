"use client";

import { useState, useEffect } from "react";
import type { LocationData } from "../navbar.types";

export function useNavbarLocation() {
  const [localidad, setLocalidad] = useState("Córdoba");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedProvincia, setSelectedProvincia] = useState<string>("cordoba");
  const [selectedCiudad, setSelectedCiudad] = useState<string>("cordoba-capital");

  // Cargar ubicación guardada al montar
  useEffect(() => {
    const ubicacionGuardada = localStorage.getItem('ubicacion');
    if (ubicacionGuardada) {
      try {
        const { provincia, ciudad, nombreCompleto } = JSON.parse(ubicacionGuardada) as LocationData;
        setSelectedProvincia(provincia);
        setSelectedCiudad(ciudad);
        setLocalidad(nombreCompleto);
      } catch (error) {
        console.error('Error al cargar ubicación guardada:', error);
      }
    }
  }, []);

  const handleLocationSelect = (provincia: string, ciudad: string, nombreCompleto: string) => {
    setSelectedProvincia(provincia);
    setSelectedCiudad(ciudad);
    setLocalidad(nombreCompleto);
    // Guardar en localStorage para persistencia
    localStorage.setItem('ubicacion', JSON.stringify({ provincia, ciudad, nombreCompleto }));
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

