'use client';

import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import Input from '@/app/components/ui/Input';
import { DollarSign, Package, List, Percent } from 'lucide-react';
import type { CreateProductoData } from '@/app/schemas/producto.schema';
import Select from '../../ui/Select';
import { useContenidoCrearProducto } from '@/app/hooks/productos/useProductos';
import type { IListaPrecio, ISituacionFiscal } from '@/app/types/producto.type';
import { formatCurrencyARS } from '@/app/utils/currency';
import {
  calcularPreviewPrecioLista,
  getPrecioSinIvaListaActiva,
} from '@/app/utils/precio-presentacion.utils';

const LISTA_TO_FIELD: Record<string, keyof CreateProductoData> = {
  V: 'precio_venta',
  O: 'precio_especial',
  P: 'precio_pvp',
  Q: 'precio_campanya',
} as const;

const LISTAS_PRECIO_CODI = new Set(['V', 'O', 'P', 'Q']);

interface StepTwoProps {
  form: UseFormReturn<CreateProductoData>;
}

export function StepTwoPricing({ form }: StepTwoProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const { listasPrecio, situacionesFiscales, ivas, isLoading: loadingContenido } = useContenidoCrearProducto();

  const listasConPrecio = listasPrecio.filter(
    (l) => LISTAS_PRECIO_CODI.has(l.codi_lista) && (l.venta_lista === 'S' || l.venta_lista == null)
  );
  const listasParaPublicar = listasPrecio.filter(
    (l) => (LISTAS_PRECIO_CODI.has(l.codi_lista) || l.codi_lista === 'E') && (l.venta_lista === 'S' || l.venta_lista == null)
  );

  const listaActiva = watch('lista_precio_activa');
  const esListaE = listaActiva === 'E' || listaActiva === 'e';
  const bonificacionPct = watch('bonificacion_porcentaje');
  const codiImpuesto = watch('codi_impuesto');
  const precioVenta = watch('precio_venta');
  const precioEspecial = watch('precio_especial');
  const precioPvp = watch('precio_pvp');
  const precioCampanya = watch('precio_campanya');
  const precioManual = watch('precio_manual');

  const porcentajeIva = useMemo(() => {
    if (!codiImpuesto) return 0;
    const found = ivas.find(
      (i) => i.codi_impuesto === codiImpuesto || String(i.id_iva) === codiImpuesto
    );
    return found?.porcentaje != null ? Number(found.porcentaje) : 0;
  }, [codiImpuesto, ivas]);

  const previewPrecio = useMemo(() => {
    const sinIva = getPrecioSinIvaListaActiva(listaActiva, {
      precio_venta: precioVenta,
      precio_especial: precioEspecial,
      precio_pvp: precioPvp,
      precio_campanya: precioCampanya,
      precio_manual: precioManual,
    });
    return calcularPreviewPrecioLista(sinIva, porcentajeIva, bonificacionPct);
  }, [
    listaActiva,
    bonificacionPct,
    porcentajeIva,
    precioVenta,
    precioEspecial,
    precioPvp,
    precioCampanya,
    precioManual,
  ]);

  const optionalNumberOptions = {
    valueAsNumber: true,
    setValueAs: (v: string | number) => (v === '' || (typeof v === 'number' && isNaN(v)) ? undefined : Number(v)),
  };

  return (
    <div className="space-y-6 px-2 max-h-[400px] overflow-y-auto">
      <h3 className="text-lg font-semibold text-input mb-4">
        Precios y Stock
      </h3>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-input font-medium">
          <List className="size-4" />
          <span>Precio por lista</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Asigná el precio sin IVA para cada lista de venta (V, O, P, Q). Al menos uno es obligatorio.
          La bonificación se aplica solo sobre la lista pública que elijas abajo.
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
              const label = lista.nombre ? `${lista.nombre} (${lista.codi_lista})` : `Lista ${lista.codi_lista}`;
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

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-input font-medium">
          <List className="size-4" />
          <span>Lista con la que se publica el producto</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Precio en tienda = precio de esta lista (con IVA). Si hay bonificación, se descuenta sobre ese monto.
        </p>
        <Select
          label="Lista pública"
          options={[
            { value: '', label: 'Seleccionar' },
            ...listasParaPublicar.map((l: IListaPrecio) => ({
              value: l.codi_lista,
              label: l.nombre ? `${l.nombre} (${l.codi_lista})` : `Lista ${l.codi_lista}`,
            })),
          ]}
          placeholder="Ej: Venta (V)"
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
              label="Precio manual (lista E) — sin IVA, no se sobreescribe por sync"
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
          Porcentaje sobre el precio de la lista pública seleccionada, con IVA incluido. No usa otras listas (ej. Venta).
        </p>
      </div>

      {previewPrecio.listaConIva != null && listaActiva && (
        <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm space-y-1">
          <p className="font-medium text-input">Vista previa (lista {String(listaActiva).toUpperCase()})</p>
          <p>
            Precio lista con IVA:{' '}
            <span className="font-semibold">{formatCurrencyARS(previewPrecio.listaConIva)}</span>
          </p>
          {previewPrecio.montoBonificacion != null && previewPrecio.montoBonificacion > 0 ? (
            <>
              <p className="text-amber-700">
                Bonificación ({bonificacionPct}%): -{formatCurrencyARS(previewPrecio.montoBonificacion)}
              </p>
              <p>
                Precio final en tienda:{' '}
                <span className="font-semibold text-principal">
                  {formatCurrencyARS(previewPrecio.finalConIva!)}
                </span>
              </p>
            </>
          ) : (
            <p>
              Precio final en tienda:{' '}
              <span className="font-semibold">{formatCurrencyARS(previewPrecio.finalConIva!)}</span>
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-input font-medium">
          <Percent className="size-4" />
          <span>Situación fiscal (IVA)</span>
        </div>
        <Select
          label="IVA"
          options={[
            { value: '', label: 'Sin IVA' },
            ...situacionesFiscales.map((s: ISituacionFiscal) => ({
              value: String(s.id_sifi),
              label: s.nombre ? `${s.nombre} (${s.codi_impuesto ?? s.codi_sifi ?? ''})` : (s.codi_impuesto ?? s.codi_sifi ?? `Sifi ${s.id_sifi}`),
            })),
          ]}
          placeholder="Seleccionar IVA"
          disabled={loadingContenido}
          value={(() => {
            const codi = watch('codi_impuesto');
            if (!codi) return '';
            const found = situacionesFiscales.find((s: ISituacionFiscal) => s.codi_impuesto === codi || s.codi_sifi === codi);
            return found ? String(found.id_sifi) : '';
          })()}
          onChange={(value) => {
            const idStr = String(value);
            if (!idStr) {
              setValue('codi_impuesto', undefined, { shouldDirty: true });
              return;
            }
            const found = situacionesFiscales.find((s: ISituacionFiscal) => String(s.id_sifi) === idStr);
            setValue('codi_impuesto', found?.codi_impuesto ?? found?.codi_sifi ?? undefined, { shouldDirty: true });
          }}
        />
      </div>

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
