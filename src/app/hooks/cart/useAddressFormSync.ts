"use client";

import { useCallback } from "react";
import { UseFormSetValue } from "react-hook-form";
import type { DatosEnvioFormData } from "@/app/schemas/envio.schema";
import type { IDireccionDTO } from "@/app/types/direccion.type";

interface UseAddressFormSyncParams {
  setValue: UseFormSetValue<DatosEnvioFormData>;
}

interface AddressFormSyncHandlers {
  handleAddressChange: (direccion: IDireccionDTO | null) => void;
  handleCityChange: (ciudad: string) => void;
  handleProvinceChange: (provincia: string) => void;
  handlePostalCodeChange: (cod_postal: string) => void;
}

/**
 * Hook responsible for syncing address autocomplete data with form fields.
 * Handles mapping from address API response to form field values.
 */
export function useAddressFormSync({
  setValue,
}: UseAddressFormSyncParams): AddressFormSyncHandlers {
  const handleAddressChange = useCallback(
    (direccion: IDireccionDTO | null) => {
      if (!direccion) return;

      let calleValue = '';

      // Extraer calle: priorizar calle separada, sino extraer de direccion_formateada
      if (direccion.calle) {
        calleValue = direccion.calle;
      } else if (direccion.direccion_formateada) {
        // Extraer solo el nombre de la calle desde la dirección formateada
        // Formato: "Calle Numero / CP XXXX - Ciudad, Provincia"
        // O: "Calle Numero - Ciudad, Provincia"
        const partes = direccion.direccion_formateada.split(/[-\/]/);
        const calleParte = partes[0]?.trim();
        if (calleParte) {
          // Remover número si está incluido (ej: "Rafael Sanzio 369" -> "Rafael Sanzio")
          calleValue = calleParte.replace(/\s+\d+$/, '').trim() || calleParte;
        }
      } else if (direccion.direccion_usuario) {
        // Si solo hay direccion_usuario, intentar extraer la calle
        const partes = direccion.direccion_usuario.split(/[-\/]/);
        const calleParte = partes[0]?.trim();
        if (calleParte) {
          calleValue = calleParte.replace(/\s+\d+$/, '').trim() || calleParte;
        }
      }

      // Actualizar todos los campos con validación para limpiar errores
      if (calleValue) {
        setValue('calle', calleValue, { shouldValidate: true });
      }

      if (direccion.numero) {
        setValue('numero', direccion.numero, { shouldValidate: true });
      }

      if (direccion.ciudad) {
        setValue('ciudad', direccion.ciudad, { shouldValidate: true });
      }

      if (direccion.provincia) {
        setValue('provincia', direccion.provincia, { shouldValidate: true });
      }

      if (direccion.cod_postal) {
        setValue('codigo_postal', direccion.cod_postal, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleCityChange = useCallback(
    (ciudad: string) => {
      setValue('ciudad', ciudad, { shouldValidate: true });
    },
    [setValue]
  );

  const handleProvinceChange = useCallback(
    (provincia: string) => {
      setValue('provincia', provincia, { shouldValidate: true });
    },
    [setValue]
  );

  const handlePostalCodeChange = useCallback(
    (cod_postal: string) => {
      setValue('codigo_postal', cod_postal, { shouldValidate: true });
    },
    [setValue]
  );

  return {
    handleAddressChange,
    handleCityChange,
    handleProvinceChange,
    handlePostalCodeChange,
  };
}
