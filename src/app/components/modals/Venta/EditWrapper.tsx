import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SimpleModal from '@/app/components/modals/SimpleModal';
import Select from '@/app/components/ui/Select';
import Textarea from '@/app/components/ui/Textarea';
import { FileText } from 'lucide-react';
import {
    updateVentaSchema,
    type UpdateVentaData
} from '@/app/schemas/venta.schema';
import { useUpdateVenta } from '@/app/hooks/ventas/useVentasMutations';
import type { IVenta } from '@/app/types/ventas.type';
import { ESTADO_PAGO_OPTIONS, ESTADO_ENVIO_OPTIONS, METODO_PAGO_OPTIONS } from '@/app/types/ventas.type';
import { Button } from '@/app/components/ui/Button';

interface EditVentaModalProps {
    venta: IVenta;
    onClose: () => void;
}

export function EditVentaModal({ venta, onClose }: EditVentaModalProps) {
    const form = useForm<UpdateVentaData>({
        resolver: zodResolver(updateVentaSchema),
        mode: 'onChange',
        defaultValues: {
            estado_pago: venta.estado_pago || undefined,
            estado_envio: venta.estado_envio || undefined,
            metodo_pago: venta.metodo_pago || undefined,
            observaciones: venta.observaciones || undefined,
        },
    });

    const { updateVenta, isUpdating } = useUpdateVenta({
        onSuccess: () => {
            form.reset();
            onClose();
        },
        onError: (error) => {
            console.error('❌ Error al actualizar venta:', error);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = await form.trigger();
        if (!isValid) return;

        const data = form.getValues();
        
        // Si hay un envío de Andreani (id_envio existe), no enviar estado_envio
        // porque Andreani lo maneja automáticamente
        if (venta.id_envio) {
            delete data.estado_envio;
        }
        
        updateVenta({ id: venta.id_venta, data });
    };

    return (
        <SimpleModal
            isOpen={true}
            onClose={onClose}
            title={`Editar venta #${venta.id_venta}`}
            maxWidth="max-w-2xl"
            actions={(handleClose) => (
                <>
                    <Button
                        onClick={handleClose}
                        variant="secondary"
                        disabled={isUpdating}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="primary"
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                </>
            )}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Estado de Pago */}
                <div>
                    <Select
                        label="Estado de pago"
                        options={[
                            { value: '', label: 'Seleccionar estado' },
                            ...ESTADO_PAGO_OPTIONS.map(opt => ({
                                value: opt.value,
                                label: opt.label,
                            }))
                        ]}
                        value={form.watch('estado_pago') || ''}
                        onChange={(value) => form.setValue('estado_pago', value as any)}
                        error={form.formState.errors.estado_pago?.message}
                    />
                </div>

                {/* Estado de Envío */}
                {/* <div>
                    <Select
                        label="Estado de envío"
                        options={[
                            { value: '', label: 'Seleccionar estado' },
                            ...ESTADO_ENVIO_OPTIONS.map(opt => ({
                                value: opt.value,
                                label: opt.label,
                            }))
                        ]}
                        value={form.watch('estado_envio') || ''}
                        onChange={(value) => form.setValue('estado_envio', value as any)}
                        error={form.formState.errors.estado_envio?.message}
                        disabled={!!venta.id_envio}
                        helperText={venta.id_envio ? 'El estado de envío lo maneja Andreani automáticamente' : undefined}
                    />
                </div> */}

                {/* Método de Pago */}
                <div>
                    <Select
                        label="Método de pago"
                        options={[
                            { value: '', label: 'Seleccionar método' },
                            ...METODO_PAGO_OPTIONS.map(opt => ({
                                value: opt.value,
                                label: opt.label,
                            }))
                        ]}
                        value={form.watch('metodo_pago') || ''}
                        onChange={(value) => form.setValue('metodo_pago', value as any)}
                        error={form.formState.errors.metodo_pago?.message}
                    />
                </div>

                {/* Observaciones */}
                <Textarea
                    label="Observaciones"
                    placeholder="Notas adicionales..."
                    icon={FileText}
                    iconPosition="left"
                    rows={4}
                    {...form.register('observaciones')}
                    error={form.formState.errors.observaciones?.message}
                />
            </form>
        </SimpleModal>
    );
}

