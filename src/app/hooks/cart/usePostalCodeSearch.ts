"use client";

import { useState, useCallback } from "react";
import { locationService } from "@/app/services/location.service";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";
import type { IDireccionOpenCageDTO } from "@/app/types/direccion.type";

interface FoundData {
  codigoPostal: string;
  ciudad: string | null;
  provincia: string | null;
}

interface UsePostalCodeSearchResult {
  searchByPostalCode: (codigoPostal: string) => Promise<void>;
  setAddressDataStore: (codigoPostal: string) => Promise<void>;
  clearPostalCode: () => void;
  isLoading: boolean;
  error: string | null;
  foundData: FoundData | null;
}

/**
 * Hook para buscar dirección por código postal usando OpenCage.
 * 
 * Flujo:
 * 1. searchByPostalCode: busca y guarda en estado temporal (NO en store)
 * 2. setAddressDataStore: confirma y guarda definitivamente en store
 * 3. clearPostalCode: limpia estado temporal
 */
export function usePostalCodeSearch(): UsePostalCodeSearchResult {
  const { setCodigoPostal, setCiudad, setProvincia } = useCheckoutStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundData, setFoundData] = useState<FoundData | null>(null);

  const searchByPostalCode = useCallback(
    async (codigoPostal: string) => {
      // Validar formato: 4 dígitos
      if (!/^[0-9]{4}$/.test(codigoPostal)) {
        setError('El código postal debe tener 4 dígitos');
        setFoundData(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setFoundData(null);

      try {
        // Buscar en OpenCage usando el código postal
        const results = await locationService.search({
          q: codigoPostal,
          limit: 1,
          country: 'ar',
        });

        if (results.length === 0) {
          setError('No se encontró información para este código postal');
          setIsLoading(false);
          setFoundData(null);
          return;
        }

        // Tomar el primer resultado (el más relevante)
        const result: IDireccionOpenCageDTO = results[0];

        // Guardar en estado temporal (NO en store todavía)
        const codPostalFinal = result.cod_postal || codigoPostal;
        setFoundData({
          codigoPostal: codPostalFinal,
          ciudad: result.ciudad || null,
          provincia: result.provincia || null,
        });

        setIsLoading(false);
      } catch (err: any) {
        console.error('Error buscando código postal:', err);
        setError(err.message || 'Error al buscar el código postal');
        setIsLoading(false);
        setFoundData(null);
      }
    },
    []
  );

  const setAddressDataStore = useCallback(
    async (codigoPostal: string) => {
      // Si hay datos encontrados, usar esos
      if (foundData) {
        setCodigoPostal(foundData.codigoPostal);
        if (foundData.ciudad) {
          setCiudad(foundData.ciudad);
        }
        if (foundData.provincia) {
          setProvincia(foundData.provincia);
        }
      } else {
        // Si no hay datos encontrados pero hay código postal válido, guardar solo el CP
        // Esto permite guardar manualmente si la búsqueda falló
        if (/^[0-9]{4}$/.test(codigoPostal)) {
          setCodigoPostal(codigoPostal);
        }
      }
    },
    [foundData, setCodigoPostal, setCiudad, setProvincia]
  );

  const clearPostalCode = useCallback(() => {
    setFoundData(null);
    setError(null);
  }, []);

  return {
    searchByPostalCode,
    setAddressDataStore,
    clearPostalCode,
    isLoading,
    error,
    foundData,
  };
}
