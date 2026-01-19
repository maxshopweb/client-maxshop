import { UseFormReturn } from 'react-hook-form';
import Select from '@/app/components/ui/Select';
import type { CreateProductoData } from '@/app/schemas/producto.schema';

interface StepThreeProps {
    form: UseFormReturn<CreateProductoData>;
}

export function StepThreeEstado({ form }: StepThreeProps) {
    const { formState: { errors } } = form;

    return (
        <div className="space-y-4 px-2">
            <h3 className="text-lg font-semibold text-input mb-4">
                Estado del Producto
            </h3>

            <div className="bg-card p-6 rounded-2xl border-2 border-card">
                <Select
                    label="Estado *"
                    options={[
                        { value: 1, label: '✅ Activo' },
                        { value: 2, label: '❌ Inactivo' }
                    ]}
                    placeholder="Seleccionar estado"
                    value={form.watch('estado') ?? ''}
                    onChange={(value) => {
                        form.setValue('estado', value as any);
                    }}
                    error={errors.estado?.message}
                />

                <div className="mt-4 p-4 bg-input/30 rounded-xl">
                    <p className="text-sm text-input">
                        <strong>Activo:</strong> El producto será visible en el catálogo y estará disponible para la venta.
                    </p>
                    <p className="text-sm text-input mt-2">
                        <strong>Inactivo:</strong> El producto estará oculto y no podrá ser vendido.
                    </p>
                </div>
            </div>
        </div>
    );
}
