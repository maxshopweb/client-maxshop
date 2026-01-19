import { UseFormReturn } from 'react-hook-form';
import Select from '@/app/components/ui/Select';
import { Combobox } from '@/app/components/ui/Combobox';
import Textarea from '@/app/components/ui/Textarea';
import { ShoppingCart, FileText, User } from 'lucide-react';
import type { CreateVentaData } from '@/app/schemas/venta.schema';
import { TIPO_VENTA_OPTIONS } from '@/app/types/ventas.type';
import { useClientes } from '@/app/hooks/clientes/useClientes';
import { MetodoPagoEfectivo } from './MetodoPagoEfectivo';
import { MetodoPagoTransferencia } from './MetodoPagoTransferencia';
import { MetodoPagoMercadoPago } from './MetodoPagoMercadoPago';

interface StepOneProps {
    form: UseFormReturn<CreateVentaData>;
}

export function StepOneVentaInfo({ form }: StepOneProps) {
    const { register, watch, setValue, formState: { errors } } = form;
    const { clientes } = useClientes({
        filters: {
            limit: 100,
            order_by: 'nombre',
            order: 'asc',
        },
    });

    const clienteOptions = clientes.map(cliente => ({
        value: cliente.id_usuario,
        label: cliente.usuario
            ? `${cliente.usuario.nombre || ''} ${cliente.usuario.apellido || ''}`.trim() || cliente.usuario.email || cliente.id_usuario
            : cliente.id_usuario,
    }));

    return (
        <div className="space-y-4 max-h-[350px] overflow-y-auto px-2">
            <h3 className="text-lg font-semibold text-input mb-4">
                Información de la venta
            </h3>

            {/* Tipo de Venta */}
            <div>
                <Select
                    label="Tipo de venta *"
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
            <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground mb-3">
                    Método de pago *
                    {errors.metodo_pago && (
                        <span className="text-red-500 text-xs ml-2">{errors.metodo_pago.message}</span>
                    )}
                </label>

                {/* Botón Mercado Pago */}
                <MetodoPagoMercadoPago
                    isSelected={watch('metodo_pago') === 'mercadopago'}
                    onClick={() => form.setValue('metodo_pago', 'mercadopago' as any)}
                />

                {/* Separador */}
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t" style={{ borderColor: "rgba(23, 28, 53, 0.1)" }}></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white text-foreground/60 text-xs">O</span>
                    </div>
                </div>

                {/* Botones Efectivo y Transferencia */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <MetodoPagoEfectivo
                        isSelected={watch('metodo_pago') === 'efectivo'}
                        onClick={() => form.setValue('metodo_pago', 'efectivo' as any)}
                    />
                    <MetodoPagoTransferencia
                        isSelected={watch('metodo_pago') === 'transferencia'}
                        onClick={() => form.setValue('metodo_pago', 'transferencia' as any)}
                    />
                </div>
            </div>

            {/* Cliente (opcional) */}
            <Combobox
                label="Cliente (opcional)"
                placeholder="Buscar cliente..."
                options={clienteOptions}
                value={watch('id_cliente') || undefined}
                onChange={(value) => setValue('id_cliente', value as string || undefined)}
                icon={User}
                iconPosition="left"
                searchable={true}
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

