'use client';

import { Search, X } from 'lucide-react';
import Input from '@/app/components/ui/Input';

interface MaestrosFilterInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  maxLength?: number;
}

export function MaestrosFilterInput({
  value,
  onChange,
  onClear,
  placeholder = 'Buscar por nombre o código...',
  maxLength = 80,
}: MaestrosFilterInputProps) {
  const showClear = value.length > 0;

  return (
    <div className="relative max-w-sm">
      <Input
        label=""
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        icon={Search}
        maxLength={maxLength}
        aria-label="Filtrar por nombre o código"
      />
      {showClear && (
        <button
          type="button"
          onClick={() => (onClear ? onClear() : onChange(''))}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-500 hover:text-foreground hover:bg-gray-100 transition-colors"
          aria-label="Limpiar filtro"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
