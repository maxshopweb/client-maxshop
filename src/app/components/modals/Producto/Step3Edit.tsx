import { UseFormReturn } from 'react-hook-form';
import Select from '@/app/components/ui/Select';
import type { CreateProductoData } from '@/app/schemas/producto.schema';
import { ToggleLeft, Eye } from 'lucide-react';

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

      {/* Estado del producto: Activo / Inactivo (validación interna) */}
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
            <strong>Inactivo:</strong> El producto queda deshabilitado internamente; no afecta por sí solo si se muestra en tienda (eso lo define &quot;Publicado&quot;).
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
    </div>
  );
}
