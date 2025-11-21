"use client";

import { ChevronDown } from "lucide-react";

interface FilterSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface FilterSelectProps {
  options: FilterSelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function FilterSelect({
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
      const parsedValue = !isNaN(Number(newValue)) && newValue !== "" ? Number(newValue) : newValue;
      onChange(parsedValue);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      )}
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={handleChange}
          disabled={disabled}
          className="w-full px-4 py-2.5 pr-10 border border-input rounded-lg bg-background text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-principal/20 focus:border-principal transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-principal/50"
        >
          {placeholder && !value && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
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

