"use client";

import { memo } from "react";
import { ChevronDown } from "lucide-react";

interface FilterSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface FilterSelectProps {
  options: FilterSelectOption[];
  value?: string | number;
  onChange?: (value: string | number | undefined) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

function FilterSelectComponent({
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  label,
  disabled = false,
  className = "",
}: FilterSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      const newValue = e.target.value;
      // Si el valor es string vacío, pasar undefined para que se elimine el filtro
      if (newValue === "") {
        onChange?.(undefined);
        return;
      }
      const parsedValue = !isNaN(Number(newValue)) && newValue !== "" ? Number(newValue) : newValue;
      onChange(parsedValue);
    }
  };

  // Normalizar valor para el select (siempre string)
  const selectValue = value !== undefined && value !== null ? String(value) : "";
  
  // Buscar el valor en las opciones (comparar normalizado ignorando ceros a la izquierda)
  const matchingOption = options.find(opt => {
    const optVal = String(opt.value);
    const searchVal = selectValue;
    
    // Comparar directamente
    if (optVal === searchVal) return true;
    
    // Comparar sin ceros a la izquierda (normalizar números)
    const optNormalized = optVal.replace(/^0+/, '') || optVal;
    const searchNormalized = searchVal.replace(/^0+/, '') || searchVal;
    
    return optNormalized === searchNormalized;
  });
  
  // Si encontramos una opción, usar su valor exacto (con ceros a la izquierda si los tiene)
  // Esto asegura que el select muestre el valor correcto
  const actualSelectValue = matchingOption ? String(matchingOption.value) : selectValue;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      )}
      <div className="relative">
        <select
          value={actualSelectValue}
          onChange={handleChange}
          disabled={disabled}
          className="w-full px-4 py-2.5 pr-10 border border-input rounded-lg bg-background text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-principal/20 focus:border-principal transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-principal/50"
        >
          {placeholder && (
            <option value="">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={String(option.value)} value={String(option.value)} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-foreground/60" />
        </div>
      </div>
    </div>
  );
}

// Memoizar para evitar re-renders innecesarios
// Si las opciones estaban vacías y ahora tienen datos, forzar re-render
export default memo(FilterSelectComponent, (prevProps, nextProps) => {
  // Normalizar valores para comparación (convertir a string)
  const prevValue = prevProps.value != null ? String(prevProps.value) : "";
  const nextValue = nextProps.value != null ? String(nextProps.value) : "";
  
  // Si las opciones cambiaron de vacío a tener datos y hay un valor, forzar re-render
  const prevOptionsEmpty = prevProps.options.length === 0;
  const nextOptionsNotEmpty = nextProps.options.length > 0;
  if (prevOptionsEmpty && nextOptionsNotEmpty && nextValue) {
    return false; // Forzar re-render
  }
  
  return (
    prevValue === nextValue &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.label === nextProps.label &&
    prevProps.className === nextProps.className &&
    prevProps.options.length === nextProps.options.length &&
    prevProps.options.every((opt, idx) => 
      String(opt.value) === String(nextProps.options[idx]?.value) &&
      opt.label === nextProps.options[idx]?.label
    )
  );
});

