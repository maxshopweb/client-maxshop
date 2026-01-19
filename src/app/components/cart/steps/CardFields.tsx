"use client";

import { IFormFieldConfig } from "@/app/types/cart.type";
import { IDatosPago } from "@/app/types/cart.type";

interface CardFieldsProps {
  field: IFormFieldConfig;
  formData: Partial<IDatosPago>;
  onChange: (name: string, value: string) => void;
  error?: string;
}

export function CardFields({ field, formData, onChange, error }: CardFieldsProps) {
  // Campos de tarjeta
  const isTarjetaField = field.name.startsWith('numero_') || 
                         field.name.startsWith('nombre_') || 
                         field.name === 'vencimiento' || 
                         field.name === 'cvv';
  
  const fieldName = isTarjetaField ? `tarjeta_${field.name.replace('_tarjeta', '')}` : field.name;
  const fieldValue = isTarjetaField 
    ? formData.tarjeta?.[field.name.replace('_tarjeta', '') as keyof typeof formData.tarjeta] || ''
    : (formData[field.name as keyof IDatosPago] as string) || '';

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground">
        {field.label}
        {field.required && <span className="text-principal ml-1">*</span>}
      </label>
      <input
        type={field.type}
        placeholder={field.placeholder}
        value={fieldValue}
        onChange={(e) => onChange(fieldName, e.target.value)}
        className="w-full px-4 py-3 bg-input/50 rounded-lg text-sm text-foreground placeholder:text-foreground/40 border border-input/50 focus:border-principal/50 focus:ring-2 focus:ring-principal/20 focus:outline-none transition-all"
        style={{
          backgroundColor: 'var(--input)',
        }}
        maxLength={field.name === 'cvv' ? 4 : field.name === 'vencimiento' ? 5 : undefined}
      />
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}

