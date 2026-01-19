import { useMemo } from "react";
import { SelectOption } from "@/app/components/ui/Select";
import { provincias } from "@/app/utils/ubicaciones";

/**
 * Hook para obtener las opciones de los selects del formulario
 */
export function useContactFormOptions() {
  const provinciaOptions = useMemo<SelectOption[]>(
    () =>
      provincias.map((p) => ({
        value: p.value,
        label: p.label,
      })),
    []
  );

  const tipoDocumentoOptions = useMemo<SelectOption[]>(
    () => [
      { value: "DNI", label: "DNI" },
      { value: "CUIT", label: "CUIT" },
    ],
    []
  );

  return {
    provinciaOptions,
    tipoDocumentoOptions,
  };
}

