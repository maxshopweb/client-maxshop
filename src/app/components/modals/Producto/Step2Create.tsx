'use client';

import { UseFormReturn } from 'react-hook-form';
import Input from '@/app/components/ui/Input';
import { DollarSign, Package, List, Percent } from 'lucide-react';
import type { CreateProductoData } from '@/app/schemas/producto.schema';
import Select from '../../ui/Select';
import { useContenidoCrearProducto } from '@/app/hooks/productos/useProductos';
import type { IListaPrecio } from '@/app/types/producto.type';

const LISTA_TO_FIELD: Record<string, keyof CreateProductoData> = {
  V: 'precio_venta',
  O: 'precio_especial',
  P: 'precio_pvp',
  Q: 'precio_campanya',
} as const;

interface StepTwoProps {
  form: UseFormReturn<CreateProductoData>;
}

export function StepTwoPricing({ form }: StepTwoProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const { listasPrecio, situacionesFiscales, isLoading: loadingContenido } = useContenidoCrearProducto();

  // Listas que tienen precio en el producto (V, O, P, Q)
  const listasConPrecio = listasPrecio.filter((l) => ['V', 'O', 'P', 'Q'].includes(l.codi_lista));

  const optionalNumberOptions = {
    valueAsNumber: true,
    setValueAs: (v: string | number) => (v === '' || (typeof v === 'number' && isNaN(v)) ? undefined : Number(v)),
  };

  return (
    <div className="space-y-6 px-2 max-h-[400px] overflow-y-auto">
      <h3 className="text-lg font-semibold text-input mb-4">
        Precios y Stock
      </h3>

      {/* Precios por lista */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-input font-medium">
          <List className="size-4" />
          <span>Precio por lista</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Asigná el precio del producto para cada lista. Al menos uno es obligatorio.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {loadingContenido ? (
            <p className="text-sm text-muted-foreground col-span-2">Cargando listas...</p>
          ) : listasConPrecio.length === 0 ? (
            <p className="text-sm text-muted-foreground col-span-2">No hay listas de precio cargadas.</p>
          ) : (
            listasConPrecio.map((lista: IListaPrecio) => {
              const fieldName = LISTA_TO_FIELD[lista.codi_lista];
              if (!fieldName) return null;
              const label = lista.nombre || `Lista ${lista.codi_lista}`;
              return (
                <Input
                  key={lista.id_lista}
                  label={label}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  icon={DollarSign}
                  {...register(fieldName as 'precio_venta', optionalNumberOptions)}
                  error={errors[fieldName]?.message as string | undefined}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Lista con la que se publica */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-input font-medium">
          <List className="size-4" />
          <span>Lista con la que se publica el producto</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Elegí qué precio mostrar en tienda (por defecto: Venta).
        </p>
        <Select
          label="Lista pública"
          options={[
            { value: '', label: 'Seleccionar' },
            ...listasConPrecio.map((l: IListaPrecio) => ({
              value: l.codi_lista,
              label: l.nombre || `Lista ${l.codi_lista}`,
            })),
          ]}
          placeholder="Ej: Venta"
          disabled={loadingContenido}
          value={String(watch('lista_precio_activa') ?? '')}
          onChange={(value) => setValue('lista_precio_activa', (value as string) || undefined, { shouldDirty: true })}
        />
      </div>

      {/* Situación fiscal (IVA) - id_sifi como value para claves únicas */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-input font-medium">
          <Percent className="size-4" />
          <span>Situación fiscal (IVA)</span>
        </div>
        <Select
          label="IVA"
          options={[
            { value: '', label: 'Sin IVA' },
            ...situacionesFiscales
              .filter((s) => (s.codi_impuesto ?? s.codi_sifi))
              .map((s) => ({
                value: String(s.id_sifi),
                label: s.nombre ? `${s.nombre} (${s.codi_impuesto ?? s.codi_sifi})` : (s.codi_impuesto ?? s.codi_sifi),
              })),
          ]}
          placeholder="Seleccionar IVA"
          disabled={loadingContenido}
          value={(() => {
            const codi = watch('codi_impuesto');
            if (!codi) return '';
            const found = situacionesFiscales.find((s) => s.codi_impuesto === codi || s.codi_sifi === codi);
            return found ? String(found.id_sifi) : '';
          })()}
          onChange={(value) => {
            const idStr = String(value);
            if (!idStr) {
              setValue('codi_impuesto', undefined, { shouldDirty: true });
              return;
            }
            const found = situacionesFiscales.find((s) => String(s.id_sifi) === idStr);
            setValue('codi_impuesto', found?.codi_impuesto ?? found?.codi_sifi ?? undefined, { shouldDirty: true });
          }}
        />
      </div>

      {/* Stock */}
      <div className="space-y-3 pt-2 border-t border-border">
        <div className="flex items-center gap-2 text-input font-medium">
          <Package className="size-4" />
          <span>Stock</span>
        </div>
        <Input
          label="Stock inicial *"
          type="number"
          placeholder="0"
          icon={Package}
          {...register('stock', { valueAsNumber: true })}
          error={errors.stock?.message}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Stock Mínimo"
            type="number"
            placeholder="0"
            {...register('stock_min', optionalNumberOptions)}
          />
          <Input
            label="Unidad de medida"
            placeholder="Ej: UN"
            {...register('unidad_medida')}
          />
        </div>
      </div>
    </div>
  );
}
