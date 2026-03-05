import { UseFormReturn } from 'react-hook-form';
import Select from '@/app/components/ui/Select';
import type { CreateProductoData } from '@/app/schemas/producto.schema';
import { ToggleLeft, Eye, CreditCard } from 'lucide-react';

interface StepThreeProps {
  form: UseFormReturn<CreateProductoData>;
}

export function StepThreeEstado({ form }: StepThreeProps) {
  const { formState: { errors } } = form;

  return (
    <div className="space-y-6 px-2">
      <h3 className="text-lg font-semibold text-input mb-4">
        Estado y visibilidad
      </h3>

      {/* Estado del producto: Activo / Inactivo / Pausado */}
      <div className="bg-card p-6 rounded-2xl border-2 border-card space-y-4">
        <div className="flex items-center gap-2 text-input font-medium">
          <ToggleLeft className="size-5" />
          <span>Estado del producto</span>
        </div>
        <Select
          label="Estado *"
          options={[
            { value: 1, label: '✅ Activo' },
            { value: 2, label: '❌ Inactivo' },
            { value: 3, label: '⏸ Pausado' },
          ]}
          placeholder="Seleccionar estado"
          value={form.watch('estado') ?? ''}
          onChange={(value) => form.setValue('estado', value as number)}
          error={errors.estado?.message}
        />
        <div className="p-4 bg-input/30 rounded-xl">
          <p className="text-sm text-input">
            <strong>Activo:</strong> El producto está habilitado en el sistema (stock, precios, etc.).
          </p>
          <p className="text-sm text-input mt-2">
            <strong>Inactivo:</strong> El producto queda deshabilitado; sin stock en depósito MAXSHOP se sugiere este estado.
          </p>
          <p className="text-sm text-input mt-2">
            <strong>Pausado:</strong> El producto está temporalmente pausado (no se muestra en tienda como disponible).
          </p>
        </div>
      </div>

      {/* Publicado: mostrar u ocultar en tienda */}
      <div className="bg-card p-6 rounded-2xl border-2 border-card space-y-4">
        <div className="flex items-center gap-2 text-input font-medium">
          <Eye className="size-5" />
          <span>Visibilidad en tienda</span>
        </div>
        <Select
          label="Publicado"
          options={[
            { value: 'true', label: '👁 Publicado (visible en tienda)' },
            { value: 'false', label: '👁‍🗨 No publicado (oculto al usuario)' },
          ]}
          placeholder="Seleccionar"
          value={form.watch('publicado') === true ? 'true' : form.watch('publicado') === false ? 'false' : ''}
          onChange={(value) => form.setValue('publicado', value === 'true')}
          error={errors.publicado?.message}
        />
        <div className="p-4 bg-input/30 rounded-xl">
          <p className="text-sm text-input">
            <strong>Publicado:</strong> El producto se muestra en la tienda y los clientes pueden comprarlo.
          </p>
          <p className="text-sm text-input mt-2">
            <strong>No publicado:</strong> El producto no se muestra en la tienda; solo lo ves en el panel de administración.
          </p>
        </div>
      </div>

      {/* Cuotas sin interés (Mercado Pago) */}
      <div className="bg-card p-6 rounded-2xl border-2 border-card space-y-4">
        <div className="flex items-center gap-2 text-input font-medium">
          <CreditCard className="size-5" />
          <span>3 cuotas sin interés (Mercado Pago)</span>
        </div>
        <Select
          label="Cuotas"
          options={[
            { value: 'regla', label: '📋 Regla general (según monto mínimo en Config)' },
            { value: 'si', label: '✅ Siempre ofrecer 3 cuotas (aunque no alcance el mínimo)' },
            { value: 'no', label: '❌ No ofrecer 3 cuotas (aunque supere el mínimo)' },
          ]}
          placeholder="Seleccionar"
          value={form.watch('cuotas_habilitadas') ?? 'regla'}
          onChange={(value) => form.setValue('cuotas_habilitadas', (value as 'regla' | 'si' | 'no') ?? 'regla')}
          error={errors.cuotas_habilitadas?.message}
        />
        <div className="p-4 bg-input/30 rounded-xl">
          <p className="text-sm text-input">
            <strong>Regla general:</strong> Se usa la configuración de la tienda (monto mínimo para 3 cuotas).
          </p>
          <p className="text-sm text-input mt-2">
            <strong>Siempre 3 cuotas:</strong> Este producto habilita 3 cuotas aunque el total del carrito no alcance el mínimo.
          </p>
          <p className="text-sm text-input mt-2">
            <strong>No 3 cuotas:</strong> Si este producto está en el carrito, no se ofrecen 3 cuotas en el checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
