'use client';

import { UseFormReturn } from 'react-hook-form';
import Input from '@/app/components/ui/Input';
import { DollarSign, Package, List, Percent } from 'lucide-react';
import type { CreateProductoData } from '@/app/schemas/producto.schema';
import Select from '../../ui/Select';
import { useContenidoCrearProducto } from '@/app/hooks/productos/useProductos';
import type { IListaPrecio } from '@/app/types/producto.type';
import type { IIva } from '@/app/types/iva.type';
import { calcularPrecioConIva, formatearPrecio } from '@/app/utils/producto.utils';

const CODI_IVA_DEFAULT = '01';

const LISTA_TO_FIELD: Record<string, keyof CreateProductoData> = {
  V: 'precio_venta',
  O: 'precio_especial',
  P: 'precio_pvp',
  Q: 'precio_campanya',
} as const;

interface StepTwoProps {
  form: UseFormReturn<CreateProductoData>;
}

function formatIvaOptionLabel(iva: IIva): string {
  const codi = iva.codi_impuesto?.trim() ?? '';
  const pct =
    iva.porcentaje != null && !Number.isNaN(Number(iva.porcentaje))
      ? `${Number(iva.porcentaje)}%`
      : null;
  const nombre = iva.nombre?.trim();
  if (pct && nombre) return `${pct} — ${nombre}${codi ? ` (${codi})` : ''}`;
  if (pct) return `${pct}${codi ? ` (${codi})` : ''}`;
  if (nombre) return `${nombre}${codi ? ` (${codi})` : ''}`;
  return codi || `IVA ${iva.id_iva}`;
}

function getPrecioNetoListaActiva(
  listaActiva: string | undefined,
  values: Pick<
    CreateProductoData,
    'precio_venta' | 'precio_especial' | 'precio_pvp' | 'precio_campanya' | 'precio_manual'
  >
): number | null {
  const lista = (listaActiva ?? 'V').toUpperCase();
  const pick = (v: number | undefined) =>
    v != null && !Number.isNaN(v) && v > 0 ? v : null;
  if (lista === 'E') return pick(values.precio_manual);
  if (lista === 'V') return pick(values.precio_venta);
  if (lista === 'O') return pick(values.precio_especial);
  if (lista === 'P') return pick(values.precio_pvp);
  if (lista === 'Q') return pick(values.precio_campanya);
  return (
    pick(values.precio_venta) ??
    pick(values.precio_especial) ??
    pick(values.precio_pvp) ??
    pick(values.precio_campanya) ??
    pick(values.precio_manual)
  );
}

export function StepTwoPricing({ form }: StepTwoProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const { listasPrecio, ivas, isLoading: loadingContenido } = useContenidoCrearProducto();

  // Listas que tienen precio en el producto (V, O, P, Q) — inputs por lista
  const listasConPrecio = listasPrecio.filter((l) => ['V', 'O', 'P', 'Q'].includes(l.codi_lista));
  // Listas para el selector "con la que se publica" (incluye E = Precio especial)
  const listasParaPublicar = listasPrecio.filter((l) => ['V', 'O', 'P', 'Q', 'E'].includes(l.codi_lista));
  const listaActiva = watch('lista_precio_activa');
  const esListaE = (listaActiva === 'E' || listaActiva === 'e');
  const codiImpuesto = watch('codi_impuesto') || CODI_IVA_DEFAULT;
  const precioVenta = watch('precio_venta');
  const precioEspecial = watch('precio_especial');
  const precioPvp = watch('precio_pvp');
  const precioCampanya = watch('precio_campanya');
  const precioManual = watch('precio_manual');

  const ivaSeleccionado = ivas.find((i) => i.codi_impuesto === codiImpuesto);
  const porcentajeIva =
    ivaSeleccionado?.porcentaje != null ? Number(ivaSeleccionado.porcentaje) : 21;
  const precioNetoActivo = getPrecioNetoListaActiva(listaActiva, {
    precio_venta: precioVenta,
    precio_especial: precioEspecial,
    precio_pvp: precioPvp,
    precio_campanya: precioCampanya,
    precio_manual: precioManual,
  });
  const precioConIvaPreview =
    precioNetoActivo != null ? calcularPrecioConIva(precioNetoActivo, porcentajeIva) : null;

  const ivasOpciones = ivas.filter((i) => i.codi_impuesto?.trim());

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
          Elegí qué precio mostrar en tienda (por defecto: Venta). Si elegís &quot;Precio especial (E)&quot;, el precio no se sobreescribe por sincronización.
        </p>
        <Select
          label="Lista pública"
          options={[
            { value: '', label: 'Seleccionar' },
            ...listasParaPublicar.map((l: IListaPrecio) => ({
              value: l.codi_lista,
              label: l.nombre || (l.codi_lista === 'E' ? 'Precio especial (E)' : `Lista ${l.codi_lista}`),
            })),
          ]}
          placeholder="Ej: Venta"
          disabled={loadingContenido}
          value={String(watch('lista_precio_activa') ?? '')}
          onChange={(value) => {
            const v = (value as string) || undefined;
            setValue('lista_precio_activa', v, { shouldDirty: true });
            if (v !== 'E' && v !== 'e') setValue('precio_manual', undefined, { shouldDirty: true });
          }}
        />
        {esListaE && (
          <div className="pt-2">
            <Input
              label="Precio manual (lista E) — no se sobreescribe por sincronización"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              icon={DollarSign}
              {...register('precio_manual', optionalNumberOptions)}
              error={errors.precio_manual?.message as string | undefined}
            />
          </div>
        )}
      </div>

      {/* Bonificación a aplicar */}
      <div className="space-y-2">
        <Input
          label="Bonificación (%)"
          placeholder="Ej: 10"
          type="number"
          min="0"
          max="100"
          step="0.01"
          {...register('bonificacion_porcentaje', optionalNumberOptions)}
          error={errors.bonificacion_porcentaje?.message as string | undefined}
        />
        <p className="text-xs text-muted-foreground">
          Porcentaje de bonificación por defecto para este producto. Se aplica sobre el total de la línea y se envía al Excel.
        </p>
      </div>

      {/* IVA del producto (tabla iva / codi_impuesto) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-input font-medium">
          <Percent className="size-4" />
          <span>IVA del producto</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Los precios de lista se ingresan sin IVA. El porcentaje seleccionado se aplica al publicar en tienda y en el checkout.
        </p>
        <Select
          label="Alícuota de IVA"
          options={
            loadingContenido
              ? []
              : ivasOpciones.map((iva: IIva) => ({
                  value: iva.codi_impuesto!.trim(),
                  label: formatIvaOptionLabel(iva),
                }))
          }
          placeholder={loadingContenido ? 'Cargando...' : 'Seleccionar IVA'}
          disabled={loadingContenido || ivasOpciones.length === 0}
          value={codiImpuesto}
          onChange={(value) => {
            const codi = String(value).trim();
            setValue('codi_impuesto', codi || CODI_IVA_DEFAULT, { shouldDirty: true });
          }}
        />
        {precioConIvaPreview != null && (
          <p className="text-xs text-muted-foreground">
            Precio neto lista activa: {formatearPrecio(precioNetoActivo)} → con IVA ({porcentajeIva}%):{' '}
            <span className="font-medium text-foreground">{formatearPrecio(precioConIvaPreview)}</span>
          </p>
        )}
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
