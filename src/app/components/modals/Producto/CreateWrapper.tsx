import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import StepModal from '@/app/components/modals/StepModal';
import { StepOneBasicInfo } from './Step1Create';
import { StepTwoPricing } from './Step2Create';
import { ProductoImagenesEditor } from './ProductoImagenesEditor';
import {
    createProductoSchema,
    type CreateProductoData
} from '@/app/schemas/producto.schema';
import { productosService } from '@/app/services/producto.service';
import { uploadService } from '@/app/services/upload.service';
import { productosKeys } from '@/app/hooks/productos/useProductos';

interface CreateProductoModalProps {
    onClose: () => void;
}

export function CreateProductoModal({ onClose }: CreateProductoModalProps) {
    const queryClient = useQueryClient();
    const [mainFile, setMainFile] = useState<File | null>(null);
    const [secondaryFiles, setSecondaryFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CreateProductoData>({
        resolver: zodResolver(createProductoSchema),
        mode: 'onChange',
        defaultValues: {
            destacado: false,
            financiacion: false,
            stock: 0,
            lista_precio_activa: 'V',
        },
    });

    const validateStepOne = async () => {
        const fields = ['codi_arti', 'nombre'];
        const isValid = await form.trigger(fields as any);
        return isValid;
    };

    const validateStepTwo = async () => {
        const fields = ['precio_venta', 'precio_especial', 'precio_pvp', 'precio_campanya', 'stock'];
        const isValid = await form.trigger(fields as any);
        return isValid;
    };

    const validateStepThree = () => Promise.resolve(true);

    const handleComplete = async (): Promise<boolean> => {
        const isValid = await form.trigger();
        if (!isValid) {
            const firstError = Object.values(form.formState.errors)[0];
            const message = firstError?.message ? String(firstError.message) : 'Revisá los campos marcados.';
            toast.error('Completá los datos requeridos', { description: message });
            return false;
        }

        setIsSubmitting(true);
        try {
            const rawData = form.getValues();
            const data: any = {
                codi_arti: rawData.codi_arti,
                nombre: rawData.nombre,
                descripcion: rawData.descripcion,
                cod_sku: rawData.cod_sku,
                id_interno: rawData.id_interno,
                modelo: rawData.modelo,
                precio_venta: rawData.precio_venta ?? undefined,
                precio_especial: rawData.precio_especial ?? undefined,
                precio_pvp: rawData.precio_pvp ?? undefined,
                precio_campanya: rawData.precio_campanya ?? undefined,
                lista_precio_activa: rawData.lista_precio_activa || undefined,
                stock: rawData.stock,
                stock_min: rawData.stock_min ?? undefined,
                stock_mayorista: rawData.stock_mayorista ?? undefined,
                codi_barras: rawData.codi_barras,
                unidad_medida: rawData.unidad_medida,
                unidades_por_producto: rawData.unidades_por_producto,
                destacado: rawData.destacado,
                financiacion: rawData.financiacion,
                codi_categoria: rawData.codi_categoria,
                codi_marca: rawData.codi_marca,
                codi_grupo: rawData.codi_grupo,
                codi_impuesto: rawData.codi_impuesto,
                id_cat: rawData.id_cat ? Number(rawData.id_cat) : undefined,
                id_subcat: rawData.id_subcat ? Number(rawData.id_subcat) : undefined,
                id_marca: rawData.id_marca ? Number(rawData.id_marca) : undefined,
                id_iva: rawData.id_iva ? Number(rawData.id_iva) : undefined,
            };

            const created = await productosService.create(data);
            const idProd = created.id_prod;

            if (mainFile) {
                await uploadService.uploadProductImage(idProd, mainFile);
            }
            for (const file of secondaryFiles) {
                await uploadService.uploadProductSecondaryImage(idProd, file);
            }

            queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productosKeys.detail(idProd) });
            queryClient.invalidateQueries({ queryKey: productosKeys.destacados() });
            queryClient.invalidateQueries({ queryKey: productosKeys.stockBajo() });

            toast.success('Producto creado correctamente', {
                description: mainFile || secondaryFiles.length ? 'Imágenes subidas.' : undefined,
            });
            form.reset();
            setMainFile(null);
            setSecondaryFiles([]);
            return true;
        } catch (error: any) {
            toast.error('Error al crear producto', {
                description: error?.message ?? 'Intente de nuevo.',
            });
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <StepModal
            isOpen={true}
            onClose={onClose}
            onComplete={handleComplete}
            isLoading={isSubmitting}
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
                {
                    title: 'Imágenes',
                    content: (
                        <ProductoImagenesEditor
                            mode="create"
                            mainFile={mainFile}
                            setMainFile={setMainFile}
                            secondaryFiles={secondaryFiles}
                            setSecondaryFiles={setSecondaryFiles}
                        />
                    ),
                    onNext: validateStepThree,
                },
            ]}
        />
    );
}
