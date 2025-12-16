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
            codi_arti: producto.codi_arti || '',
            nombre: producto.nombre || '',
            id_interno: producto.id_interno || '',
            cod_sku: producto.cod_sku || '',
            modelo: producto.modelo || '',
            codi_categoria: producto.codi_categoria || '',
            codi_marca: producto.codi_marca || '',
            codi_grupo: producto.codi_grupo || '',
            codi_impuesto: producto.codi_impuesto || '',
            codi_barras: producto.codi_barras || '',
            unidad_medida: producto.unidad_medida || '',
            unidades_por_producto: producto.unidades_por_producto || undefined,
            descripcion: producto.descripcion || '',
            id_cat: producto.id_cat?.toString() || '',
            id_subcat: producto.id_subcat?.toString() || '',
            id_marca: producto.id_marca?.toString() || '',
            destacado: producto.destacado || false,
            financiacion: producto.financiacion || false,
            precio: producto.precio || 0,
            precio_mayorista: producto.precio_mayorista || undefined,
            precio_minorista: producto.precio_minorista || undefined,
            precio_evento: producto.precio_evento || undefined,
            precio_sin_iva: producto.precio_sin_iva || undefined,
            stock: producto.stock || 0,
            stock_min: producto.stock_min || undefined,
            stock_mayorista: producto.stock_mayorista || undefined,
            id_iva: producto.id_iva || undefined,
            estado: producto.estado || undefined,
        } as any,
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
            estado: rawData.estado ? Number(rawData.estado) : undefined,
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

        console.log('📦 Datos transformados:', data);

        // Ejecutar la mutación de actualización
        updateProducto({
            id: producto.id_prod,
            data: data
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