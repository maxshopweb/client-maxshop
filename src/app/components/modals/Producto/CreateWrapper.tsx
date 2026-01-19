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
            form.reset();
            onClose();
        },
        onError: (error) => {
            console.error('❌ Error al crear producto:', error);
        }
    });

    const validateStepOne = async () => {
        const fields = ['codi_arti', 'nombre'];
        const isValid = await form.trigger(fields as any);
        return isValid;
    };

    const validateStepTwo = async () => {
        const fields = ['precio', 'stock'];
        const isValid = await form.trigger(fields as any);
        return isValid;
    };

    const handleComplete = async () => {

        // Validar todo el formulario
        const isValid = await form.trigger();

        if (!isValid) {
            return;
        }

        const rawData = form.getValues();

        // Preparar datos para el backend - usar códigos cuando estén disponibles
        const data: any = {
            codi_arti: rawData.codi_arti,
            nombre: rawData.nombre,
            precio: rawData.precio,
            descripcion: rawData.descripcion,
            cod_sku: rawData.cod_sku,
            id_interno: rawData.id_interno,
            modelo: rawData.modelo,
            precio_mayorista: rawData.precio_mayorista,
            precio_minorista: rawData.precio_minorista,
            precio_evento: rawData.precio_evento,
            precio_sin_iva: rawData.precio_sin_iva,
            stock: rawData.stock,
            stock_min: rawData.stock_min,
            stock_mayorista: rawData.stock_mayorista,
            codi_barras: rawData.codi_barras,
            unidad_medida: rawData.unidad_medida,
            unidades_por_producto: rawData.unidades_por_producto,
            img_principal: rawData.img_principal,
            imagenes: rawData.imagenes,
            destacado: rawData.destacado,
            financiacion: rawData.financiacion,
            // Usar códigos cuando estén disponibles, sino usar IDs (legacy)
            codi_categoria: rawData.codi_categoria,
            codi_marca: rawData.codi_marca,
            codi_grupo: rawData.codi_grupo,
            codi_impuesto: rawData.codi_impuesto,
            // Campos legacy para compatibilidad
            id_cat: rawData.id_cat ? Number(rawData.id_cat) : undefined,
            id_subcat: rawData.id_subcat ? Number(rawData.id_subcat) : undefined,
            id_marca: rawData.id_marca ? Number(rawData.id_marca) : undefined,
            id_iva: rawData.id_iva ? Number(rawData.id_iva) : undefined,
        };


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
