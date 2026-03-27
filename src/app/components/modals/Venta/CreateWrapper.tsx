import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import StepModal from '@/app/components/modals/StepModal';
import { StepOneVentaInfo } from './Step1Create';
import { StepTwoVentaDetalles } from './Step2Create';
import {
    createVentaSchema,
    type CreateVentaFormValues,
} from '@/app/schemas/venta.schema';
import { useCreateVenta } from '@/app/hooks/ventas/useVentasMutations';
import type { ICreateVentaDTO } from '@/app/types/ventas.type';

interface CreateVentaModalProps {
    onClose: () => void;
}

export function CreateVentaModal({ onClose }: CreateVentaModalProps) {
    const form = useForm<CreateVentaFormValues>({
        resolver: zodResolver(createVentaSchema),
        mode: 'onChange',
        defaultValues: {
            tipo_venta: '',
            metodo_pago: '',
            detalles: [],
        },
    });

    const { createVenta, isCreating } = useCreateVenta({
        onSuccess: (data) => {
            form.reset();
            onClose();
        },
        onError: (error) => {
            console.error('❌ Error al crear venta:', error);
        }
    });

    const validateStepOne = async () => {
        return form.trigger(['tipo_venta', 'metodo_pago']);
    };

    const validateStepTwo = async () => {
        return form.trigger('detalles');
    };

    const handleComplete = async () => {
        const isValid = await form.trigger();
        if (!isValid) {
            return;
        }

        const rawData = createVentaSchema.parse(form.getValues());

        const data: ICreateVentaDTO = {
            id_cliente: rawData.id_cliente || undefined,
            metodo_pago: rawData.metodo_pago,
            tipo_venta: rawData.tipo_venta,
            observaciones: rawData.observaciones || undefined,
            detalles: rawData.detalles.map((detalle) => ({
                id_prod: detalle.id_prod,
                cantidad: detalle.cantidad,
                precio_unitario: detalle.precio_unitario,
                descuento_aplicado: detalle.descuento_aplicado || 0,
                evento_aplicado: detalle.evento_aplicado || undefined,
            })),
        };

        createVenta(data);
    };

    return (
        <StepModal
            isOpen={true}
            onClose={onClose}
            onComplete={handleComplete}
            isLoading={isCreating}
            title="Crear nueva venta"
            steps={[
                {
                    title: 'Información de venta',
                    content: <StepOneVentaInfo form={form} />,
                    onNext: validateStepOne,
                },
                {
                    title: 'Productos',
                    content: <StepTwoVentaDetalles form={form} />,
                    onNext: validateStepTwo,
                },
            ]}
        />
    );
}

