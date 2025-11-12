import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import StepModal from '@/app/components/modals/StepModal';
import { StepOneBasicInfo } from './Step1Create';
import { StepTwoPricing } from './Step2Create';
import {
    createProductoSchema,
    type CreateProductoData
} from '@/app/schemas/producto.schema';
import { useCreateProducto } from '@/app/hooks/productos/useProductosMutations';

interface CreateProductoModalProps {
    onClose: () => void;
}

export function CreateProductoModal({ onClose }: CreateProductoModalProps) {
    const form = useForm<CreateProductoData>({
        resolver: zodResolver(createProductoSchema),
        mode: 'onChange',
        defaultValues: {
            destacado: false,
            financiacion: false,
            stock: 0,
        },
    });

    const { createProducto, isCreating } = useCreateProducto({
        onSuccess: (data) => {
            console.log('✅ Producto creado exitosamente:', data);
            form.reset();
            onClose();
        },
        onError: (error) => {
            console.error('❌ Error al crear producto:', error);
        }
    });

    const validateStepOne = async () => {
        const fields = ['nombre'];
        const isValid = await form.trigger(fields as any);
        console.log('Step 1 validation:', isValid);
        return isValid;
    };

    const validateStepTwo = async () => {
        const fields = ['precio', 'stock'];
        const isValid = await form.trigger(fields as any);
        console.log('Step 2 validation:', isValid);
        return isValid;
    };

    const handleComplete = async () => {
        console.log('🚀 handleComplete iniciado');

        // Validar todo el formulario
        const isValid = await form.trigger();
        console.log('Formulario válido:', isValid);

        if (!isValid) {
            console.log('Errores de validación:', form.formState.errors);
            return;
        }

        const rawData = form.getValues();

        // Transformar los valores string a number para los selects
        const data = {
            ...rawData,
            id_cat: rawData.id_cat ? Number(rawData.id_cat) : undefined,
            id_subcat: rawData.id_subcat ? Number(rawData.id_subcat) : undefined,
            id_marca: rawData.id_marca ? Number(rawData.id_marca) : undefined,
            id_iva: rawData.id_iva ? Number(rawData.id_iva) : undefined,
            estado: rawData.estado ? Number(rawData.estado) : undefined,
        };

        console.log('📦 Datos del formulario:', data);
        console.log('🔄 Llamando a createProducto...');

        // Ejecutar la mutación
        createProducto(data);
    };

    return (
        <StepModal
            isOpen={true}
            onClose={onClose}
            onComplete={handleComplete}
            isLoading={isCreating}
            title="Crear nuevo producto"
            steps={[
                {
                    title: 'Información Básica',
                    content: <StepOneBasicInfo form={form} />,
                    onNext: validateStepOne,
                },
                {
                    title: 'Precios y Stock',
                    content: <StepTwoPricing form={form} />,
                    onNext: validateStepTwo,
                },
            ]}
        />
    );
}