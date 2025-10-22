import { UseFormReturn } from 'react-hook-form';
import Input from '@/app/components/ui/Input';
import { DollarSign, Package } from 'lucide-react';
import type { CreateProductoData } from '@/app/schemas/producto.schema';
import Select from '../../ui/Select';

interface StepTwoProps {
    form: UseFormReturn<CreateProductoData>;
}

export function StepTwoPricing({ form }: StepTwoProps) {
    const { register, formState: { errors } } = form;

    return (
        <div className="space-y-4 px-2">
            <h3 className="text-lg font-semibold text-input mb-4">
                Precios y Stock
            </h3>

            <Input
                label="Precio de Venta *"
                type="number"
                step="0.01"
                placeholder="0.00"
                icon={DollarSign}
                {...register('precio', { valueAsNumber: true })}
                error={errors.precio?.message}
            />

            <div className="grid grid-cols-3 gap-3">
                <Input
                    label="Precio Mayorista"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('precio_mayorista', { valueAsNumber: true })}
                />
                <Input
                    label="Precio Minorista"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('precio_minorista', { valueAsNumber: true })}
                />
                <Input
                    label="Precio Evento"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('precio_evento', { valueAsNumber: true })}
                />
            </div>

            <Input
                label="Stock Inicial *"
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
                    {...register('stock_min', { valueAsNumber: true })}
                />
                <Input
                    label="Stock Mayorista"
                    type="number"
                    placeholder="0"
                    {...register('stock_mayorista', { valueAsNumber: true })}
                />
            </div>

            {/* IVA */}
            <Select
                label="IVA"
                options={[
                    { value: '', label: 'Sin IVA' },
                    { value: 1, label: '21%' },
                    { value: 2, label: '10.5%' }
                ]}
                placeholder="Seleccionar IVA"
                {...register('id_iva')}
            />
        </div>
    );
}