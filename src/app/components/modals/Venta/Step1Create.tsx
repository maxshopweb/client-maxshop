import { UseFormReturn } from 'react-hook-form';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import Textarea from '@/app/components/ui/Textarea';
import { CreditCard, ShoppingCart, FileText } from 'lucide-react';
import type { CreateVentaData } from '@/app/schemas/venta.schema';
import { METODO_PAGO_OPTIONS, TIPO_VENTA_OPTIONS } from '@/app/types/ventas.type';

interface StepOneProps {
    form: UseFormReturn<CreateVentaData>;
}

export function StepOneVentaInfo({ form }: StepOneProps) {
    const { register, watch, formState: { errors } } = form;

    return (
        <div className="space-y-4 max-h-[350px] overflow-y-auto px-2">
            <h3 className="text-lg font-semibold text-input mb-4">
                Información de la Venta
            </h3>

            {/* Tipo de Venta */}
            <div>
                <Select
                    label="Tipo de Venta *"
                    options={[
                        { value: '', label: 'Seleccionar tipo' },
                        ...TIPO_VENTA_OPTIONS.map(opt => ({
                            value: opt.value,
                            label: opt.label,
                        }))
                    ]}
                    value={watch('tipo_venta') || ''}
                    onChange={(value) => form.setValue('tipo_venta', value as any)}
                    error={errors.tipo_venta?.message}
                    icon={ShoppingCart}
                />
            </div>

            {/* Método de Pago */}
            <div>
                <Select
                    label="Método de Pago *"
                    options={[
                        { value: '', label: 'Seleccionar método' },
                        ...METODO_PAGO_OPTIONS.map(opt => ({
                            value: opt.value,
                            label: opt.label,
                        }))
                    ]}
                    value={watch('metodo_pago') || ''}
                    onChange={(value) => form.setValue('metodo_pago', value as any)}
                    error={errors.metodo_pago?.message}
                    icon={CreditCard}
                />
            </div>

            {/* ID Cliente (opcional) */}
            <Input
                label="ID Cliente (opcional)"
                placeholder="ID del cliente"
                {...register('id_cliente')}
                error={errors.id_cliente?.message}
            />

            {/* Observaciones */}
            <Textarea
                label="Observaciones"
                placeholder="Notas adicionales sobre la venta..."
                icon={FileText}
                iconPosition="left"
                rows={4}
                {...register('observaciones')}
                error={errors.observaciones?.message}
            />
        </div>
    );
}

