import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import Select from '@/app/components/ui/Select';
import { useConfigTienda } from '@/app/hooks/config/useConfigTienda';
import type { CreateProductoData } from '@/app/schemas/producto.schema';
import { ToggleLeft, Eye, CreditCard } from 'lucide-react';

interface StepThreeProps {
  form: UseFormReturn<CreateProductoData>;
}

export function StepThreeEstado({ form }: StepThreeProps) {
  const { formState: { errors } } = form;
  const { data: config } = useConfigTienda();
  const numCuotas =
    config?.cuotas_sin_interes != null
      ? Math.max(1, Math.trunc(Number(config.cuotas_sin_interes)))
      : 3;

  const cuotasOptions = useMemo(
    () => [
      { value: 'regla' as const, label: '📋 Regla general' },
      { value: 'si' as const, label: `✅ Siempre ${numCuotas} cuotas` },
      { value: 'no' as const, label: `❌ Sin ${numCuotas} cuotas` },
    ],
    [numCuotas]
  );

  return (
    <div className="px-2 max-h-[min(60vh,480px)] overflow-y-auto">
      <h3 className="text-lg font-semibold text-input mb-3">
        Estado y visibilidad
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Estado del producto */}
        <div className="bg-card p-4 rounded-xl border-2 border-card space-y-3 flex flex-col min-w-0">
          <div className="flex items-center gap-2 text-input font-medium shrink-0">
            <ToggleLeft className="size-4 shrink-0" />
            <span className="text-sm">Estado</span>
          </div>
          <Select
            label="Estado *"
            options={[
              { value: 1, label: '✅ Activo' },
              { value: 2, label: '❌ Inactivo' },
              { value: 3, label: '⏸ Pausado' },
            ]}
            placeholder="Seleccionar"
            value={form.watch('estado') ?? ''}
            onChange={(value) => form.setValue('estado', value as number)}
            error={errors.estado?.message}
          />
          <div className="p-3 bg-input/30 rounded-lg text-xs text-input space-y-1.5 flex-1 min-h-0">
            <p><strong>Activo:</strong> Habilitado (stock, precios).</p>
            <p><strong>Inactivo:</strong> Deshabilitado; sin stock se sugiere este estado.</p>
            <p><strong>Pausado:</strong> No se muestra en tienda.</p>
          </div>
        </div>

        {/* Publicado */}
        <div className="bg-card p-4 rounded-xl border-2 border-card space-y-3 flex flex-col min-w-0">
          <div className="flex items-center gap-2 text-input font-medium shrink-0">
            <Eye className="size-4 shrink-0" />
            <span className="text-sm">Visibilidad</span>
          </div>
          <Select
            label="Publicado"
            options={[
              { value: 'true', label: '👁 Publicado' },
              { value: 'false', label: '👁‍🗨 No publicado' },
            ]}
            placeholder="Seleccionar"
            value={form.watch('publicado') === true ? 'true' : form.watch('publicado') === false ? 'false' : ''}
            onChange={(value) => form.setValue('publicado', value === 'true')}
            error={errors.publicado?.message}
          />
          <div className="p-3 bg-input/30 rounded-lg text-xs text-input space-y-1.5 flex-1 min-h-0">
            <p><strong>Publicado:</strong> Visible en tienda.</p>
            <p><strong>No publicado:</strong> Solo en panel admin.</p>
          </div>
        </div>

        {/* Cuotas sin interés */}
        <div className="bg-card p-4 rounded-xl border-2 border-card space-y-3 flex flex-col min-w-0">
          <div className="flex items-center gap-2 text-input font-medium shrink-0">
            <CreditCard className="size-4 shrink-0" />
            <span className="text-sm">{numCuotas} cuotas (MP)</span>
          </div>
          <Select
            label="Cuotas"
            options={cuotasOptions}
            placeholder="Seleccionar"
            value={form.watch('cuotas_habilitadas') ?? 'regla'}
            onChange={(value) => form.setValue('cuotas_habilitadas', (value as 'regla' | 'si' | 'no') ?? 'regla')}
            error={errors.cuotas_habilitadas?.message}
          />
          <div className="p-3 bg-input/30 rounded-lg text-xs text-input space-y-1.5 flex-1 min-h-0">
            <p>
              <strong>Regla:</strong> Igual que en Configuración: cantidad ({numCuotas}), monto mínimo y si la regla está activa en tienda.
            </p>
            <p>
              <strong>Siempre:</strong> Ofrece {numCuotas} cuotas en este producto aunque no cumpla el mínimo global.
            </p>
            <p>
              <strong>Sin {numCuotas}:</strong> No ofrece esas cuotas en checkout para este producto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
