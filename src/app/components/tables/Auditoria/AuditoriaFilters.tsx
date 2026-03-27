'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { useAuditoriaFilters } from '@/app/hooks/auditoria/useAuditoriaFilters';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';

const METHOD_OPTIONS = [
  { value: '', label: 'Todos los métodos' },
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
];

/** Valores alineados con `tabla_afectada` en la API (`auditService.record`). */
const TABLA_OPTIONS = [
  { value: '', label: 'Todas las tablas' },
  { value: 'productos', label: 'Productos' },
  { value: 'banners', label: 'Banners' },
  { value: 'negocio', label: 'Negocio / tienda' },
  { value: 'ventas_pendientes_factura', label: 'Ventas pendientes factura' },
  { value: 'venta', label: 'Venta' },
  { value: 'failed_webhooks', label: 'Webhooks fallidos' },
  { value: 'usuarios', label: 'Usuarios' },
  { value: 'marcas', label: 'Marcas' },
  { value: 'categorias', label: 'Categorías' },
  { value: 'grupos', label: 'Grupos' },
];

const ESTADO_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'SUCCESS', label: 'SUCCESS' },
  { value: 'ERROR', label: 'ERROR' },
];

export function AuditoriaFilters() {
  const {
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,
    activeFiltersCount,
  } = useAuditoriaFilters();

  return (
    <div className="bg-card border border-card p-4 rounded-lg shadow-lg space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-input" />
          <span className="text-sm font-medium text-text">Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-principal rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-principal hover:bg-principal/10 rounded-sm transition-colors"
          >
            <X className="h-4 w-4" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        <Input
          label="Fecha desde"
          type="date"
          value={filters.fecha_desde ?? ''}
          onChange={(e) => setFilter('fecha_desde', e.target.value || undefined)}
          className="bg-input border-input"
        />
        <Input
          label="Fecha hasta"
          type="date"
          value={filters.fecha_hasta ?? ''}
          onChange={(e) => setFilter('fecha_hasta', e.target.value || undefined)}
          className="bg-input border-input"
        />
        <Select
          label="Tabla"
          options={TABLA_OPTIONS}
          value={filters.tabla_afectada ?? ''}
          onChange={(value) => setFilter('tabla_afectada', value ? String(value) : undefined)}
          placeholder="Tabla"
        />
        <Select
          label="Tipo / Método"
          options={METHOD_OPTIONS}
          value={filters.method ?? ''}
          onChange={(value) => setFilter('method', value ? String(value) : undefined)}
          placeholder="Método"
        />
        <Select
          label="Estado"
          options={ESTADO_OPTIONS}
          value={filters.estado ?? ''}
          onChange={(value) => setFilter('estado', value ? String(value) : undefined)}
          placeholder="Estado"
        />
      </div>
    </div>
  );
}
