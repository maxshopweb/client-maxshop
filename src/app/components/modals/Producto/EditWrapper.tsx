import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import StepModal from '@/app/components/modals/StepModal';
import { StepOneBasicInfo } from './Step1Create';
import { StepTwoPricing } from './Step2Create';
import { StepThreeEstado } from './Step3Edit';
import {
    createProductoSchema,
    type CreateProductoData
} from '@/app/schemas/producto.schema';
import { useUpdateProducto } from '@/app/hooks/productos/useProductosMutations';
import type { IProductos } from '@/app/types/producto.type';

interface EditProductoModalProps {
    producto: IProductos;
    onClose: () => void;
}

export function EditProductoModal({ producto, onClose }: EditProductoModalProps) {
    const form = useForm<CreateProductoData>({
        resolver: zodResolver(createProductoSchema),
        mode: 'onChange',
        defaultValues: {
            nombre: producto.nombre || '',
            id_interno: producto.id_interno || '',
            cod_sku: producto.cod_sku || '',
            modelo: producto.modelo || '',
            id_cat: producto.subcategoria?.id_cat?.toString() || '',
            id_subcat: producto.id_subcat?.toString() || '',
            descripcion: producto.descripcion || '',
            id_marca: producto.id_marca?.toString() || '',
            destacado: producto.destacado || false,
            financiacion: producto.financiacion || false,
            precio: producto.precio || 0,
            precio_mayorista: producto.precio_mayorista || undefined,
            precio_minorista: producto.precio_minorista || undefined,
            precio_evento: producto.precio_evento || undefined,
            stock: producto.stock || 0,
            stock_min: producto.stock_min || undefined,
            stock_mayorista: producto.stock_mayorista || undefined,
            id_iva: producto.id_iva?.toString() || '',
            estado: producto.estado as 0 | 1 | undefined,
        },
    });

    const { updateProducto, isUpdating } = useUpdateProducto({
        onSuccess: () => {
            form.reset();
            onClose();
        },
        onError: (error) => {
            console.error('❌ Error al actualizar producto:', error);
        }
    });

    const validateStepOne = async () => {
        const fields = ['nombre'];
        return await form.trigger(fields as any);
    };

    const validateStepTwo = async () => {
        const fields = ['precio', 'stock'];
        return await form.trigger(fields as any);
    };

    const validateStepThree = async () => {
        return true;
    };

    const handleComplete = async () => {
        const isValid = await form.trigger();
        console.log(isValid);
        
        if (!isValid) {
            console.log('Errores de validación:', form.formState.errors);
            return;
        }
        
        const data = form.getValues();
        
        // Ejecutar la mutación de actualización
        updateProducto({
            id: producto.id_prod,
            data: data as any
        });
    };

    return (
        <StepModal
            isOpen={true}
            onClose={onClose}
            onComplete={handleComplete}
            isLoading={isUpdating}
            title={`Editar: ${producto.nombre}`}
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
                {
                    title: 'Estado',
                    content: <StepThreeEstado form={form} />,
                    onNext: validateStepThree,
                },
            ]}
        />
    );
}