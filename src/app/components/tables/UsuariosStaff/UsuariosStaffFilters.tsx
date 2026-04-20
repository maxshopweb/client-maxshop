'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import FilterSelect from '@/app/components/ui/FilterSelect';
import type { AdminStaffFiltersState } from '@/app/hooks/admin-staff/useAdminStaffFilters';

export type UsuariosStaffFiltersProps = AdminStaffFiltersState;

const ROL_OPTIONS = [
  { value: '', label: 'Todos los roles' },
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'USER', label: 'USER' }
];

const ACTIVO_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Activo' },
  { value: 'false', label: 'Inactivo' }
];

type AdvancedDraft = {
  nombre: string;
  apellido: string;
  email: string;
  rol: 'ADMIN' | 'USER' | undefined;
  activo: boolean | undefined;
};

function draftFromFilters(f: AdminStaffFiltersState['filters']): AdvancedDraft {
  return {
    nombre: f.nombre ?? '',
    apellido: f.apellido ?? '',
    email: f.email ?? '',
    rol: f.rol,
    activo: f.activo
  };
}

export function UsuariosStaffFilters({
  filters,
  localSearch,
  setLocalSearch,
  setFilters,
  clearFilters,
  hasActiveFilters,
  activeFiltersCount
}: UsuariosStaffFiltersProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [draft, setDraft] = useState<AdvancedDraft>(() => draftFromFilters(filters));

  const handleAdvancedOpenChange = useCallback(
    (open: boolean) => {
      setAdvancedOpen(open);
      if (open) {
        setDraft(draftFromFilters(filters));
      }
    },
    [filters]
  );

  const applyAdvanced = useCallback(() => {
    setFilters({
      nombre: draft.nombre.trim() || undefined,
      apellido: draft.apellido.trim() || undefined,
      email: draft.email.trim() || undefined,
      rol: draft.rol,
      activo: draft.activo,
      page: 1
    });
    setAdvancedOpen(false);
  }, [draft, setFilters]);

  const handleClearAll = useCallback(() => {
    clearFilters();
    setDraft({
      nombre: '',
      apellido: '',
      email: '',
      rol: undefined,
      activo: undefined
    });
  }, [clearFilters]);

  return (
    <div className="bg-card border border-card p-4 rounded-lg shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-start">
        <div className="flex-1 min-w-0">
          <Input
            type="text"
            placeholder="Buscar en nombre, apellido, email o usuario…"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            icon={Search}
            iconPosition="left"
          />
        </div>

        <Popover.Root open={advancedOpen} onOpenChange={handleAdvancedOpenChange}>
          <Popover.Trigger asChild>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-input border border-input rounded-sm text-sm font-medium text-input hover:bg-input/80 transition-all whitespace-nowrap shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-principal rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="w-[min(100vw-2rem,28rem)] bg-card rounded-lg shadow-xl border border-card p-4 space-y-3 z-50 max-h-[min(80vh,28rem)] overflow-y-auto"
              align="end"
              sideOffset={8}
              collisionPadding={16}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-input">Filtros avanzados</h3>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-xs text-principal hover:opacity-80 font-medium inline-flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Limpiar todo
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Input
                  label="Nombre (contiene)"
                  value={draft.nombre}
                  onChange={(e) => setDraft((d) => ({ ...d, nombre: e.target.value }))}
                  placeholder="Ej. Juan"
                />
                <Input
                  label="Apellido (contiene)"
                  value={draft.apellido}
                  onChange={(e) => setDraft((d) => ({ ...d, apellido: e.target.value }))}
                  placeholder="Ej. Pérez"
                />
                <Input
                  label="Email (contiene)"
                  value={draft.email}
                  onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                  placeholder="Ej. @maxshop.com"
                />
                <FilterSelect
                  label="Rol"
                  placeholder="Rol"
                  options={ROL_OPTIONS}
                  value={draft.rol ?? ''}
                  onChange={(v) =>
                    setDraft((d) => ({
                      ...d,
                      rol: v === undefined || v === '' ? undefined : (String(v) as 'ADMIN' | 'USER')
                    }))
                  }
                />
                <FilterSelect
                  label="Activo / inactivo"
                  placeholder="Estado"
                  options={ACTIVO_OPTIONS}
                  value={draft.activo === undefined ? '' : draft.activo ? 'true' : 'false'}
                  onChange={(v) => {
                    if (v === undefined || v === '') setDraft((d) => ({ ...d, activo: undefined }));
                    else setDraft((d) => ({ ...d, activo: String(v) === 'true' }));
                  }}
                />
              </div>

              <Button type="button" variant="primary" className="w-full mt-1" onClick={applyAdvanced}>
                Aplicar filtros
              </Button>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  );
}
