"use client";

import { memo } from "react";
import FilterSelect from "@/app/components/ui/FilterSelect";
import { motion } from "framer-motion";
import type { FilterOption } from "../filters.types";

interface FilterSelectSectionProps {
  title: string;
  options: FilterOption[];
  value?: string;
  placeholder?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
}

function FilterSelectSectionComponent({
  title,
  options,
  value,
  placeholder = "Seleccionar...",
  onChange,
  disabled = false,
}: FilterSelectSectionProps) {
  return (
    <motion.div
      className="space-y-4 p-4 border border-input rounded-lg bg-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-base font-semibold text-foreground uppercase tracking-wide">{title}</h3>
      <div className="space-y-2">
        <FilterSelect
          placeholder={placeholder}
          options={options}
          value={value ? String(value) : ''}
          disabled={disabled}
          onChange={(val) => {
            // Si el valor es string vacío, undefined, o null, eliminar filtro
            if (val === '' || val === undefined || val === null) {
              onChange(undefined);
            } else {
              // Encontrar la opción correspondiente para usar su valor exacto (con ceros a la izquierda si los tiene)
              const selectedOption = options.find(opt => {
                const optVal = String(opt.value);
                const searchVal = String(val);
                // Comparar directamente
                if (optVal === searchVal) return true;
                // Comparar sin ceros a la izquierda
                const optNormalized = optVal.replace(/^0+/, '') || optVal;
                const searchNormalized = searchVal.replace(/^0+/, '') || searchVal;
                return optNormalized === searchNormalized;
              });
              
              // Usar el valor exacto de la opción (con formato original) para mantener consistencia
              const finalValue = selectedOption ? String(selectedOption.value) : String(val);
              onChange(finalValue);
            }
          }}
        />
      </div>
    </motion.div>
  );
}

// Memoizar para evitar re-renders innecesarios
// Si las opciones estaban vacías y ahora tienen datos, forzar re-render para que se muestre el valor seleccionado
export const FilterSelectSection = memo(FilterSelectSectionComponent, (prevProps, nextProps) => {
  // Normalizar valores para comparación
  const prevValue = prevProps.value != null ? String(prevProps.value) : "";
  const nextValue = nextProps.value != null ? String(nextProps.value) : "";
  
  // Si las opciones cambiaron de vacío a tener datos y hay un valor, forzar re-render
  const prevOptionsEmpty = prevProps.options.length === 0;
  const nextOptionsNotEmpty = nextProps.options.length > 0;
  if (prevOptionsEmpty && nextOptionsNotEmpty && nextValue) {
    return false; // Forzar re-render
  }
  
  return (
    prevProps.title === nextProps.title &&
    prevValue === nextValue &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.options.length === nextProps.options.length &&
    prevProps.options.every((opt, idx) => 
      String(opt.value) === String(nextProps.options[idx]?.value) &&
      opt.label === nextProps.options[idx]?.label
    )
  );
});

