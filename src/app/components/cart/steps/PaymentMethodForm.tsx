"use client";

import { IDatosPago } from "@/app/types/cart.type";
import { IFormFieldConfig } from "@/app/types/cart.type";
import Select from "@/app/components/ui/Select";

interface PaymentMethodFormProps {
  field: IFormFieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function PaymentMethodForm({ field, value, onChange, error }: PaymentMethodFormProps) {
  const handleChange = (value: string | number) => {
    onChange(String(value));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground/90">
        {field.label}
        {field.required && <span className="text-principal ml-1">*</span>}
      </label>
      <Select
        options={field.options || []}
        value={value}
        onChange={handleChange}
        className="bg-input/50 rounded-lg text-sm text-foreground border border-input/50 focus:border-principal/50 transition-colors"
      />
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}

