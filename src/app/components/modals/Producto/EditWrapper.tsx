import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import StepModal from '@/app/components/modals/StepModal';
import { StepOneBasicInfo } from './Step1Create';
import { StepTwoPricing } from './Step2Create';
import { StepThreeEstado } from './Step3Edit';
import {
    createProductoSchema,
    type CreateProductoData
} from '@/app/schemas/producto.schema';
import { useUpdateProducto, useRestaurarPreciosDesdeExcel } from '@/app/hooks/productos/useProductosMutations';
import type { IProductos } from '@/app/types/producto.type';
import { Button } from '@/app/components/ui/Button';
import { FileSpreadsheet } from 'lucide-react';

interface EditProductoModalProps {
    producto: IProductos;
    onClose: () => void;
}

export function EditProductoModal({ producto, onClose }: EditProductoModalProps) {
    const form = useForm<CreateProductoData>({
        resolver: zodResolver(createProductoSchema) as Resolver<CreateProductoData>,
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
            id_cat: producto.id_cat ?? undefined,
            id_subcat: producto.id_subcat ?? undefined,
            id_marca: producto.id_marca ?? undefined,
            destacado: Boolean(producto.destacado === true || (producto as { destacado?: boolean | number }).destacado === 1),
            financiacion: Boolean(producto.financiacion === true || (producto as { financiacion?: boolean | number }).financiacion === 1),
            precio_venta: producto.precio_venta ?? undefined,
            precio_especial: producto.precio_especial ?? undefined,
            precio_pvp: producto.precio_pvp ?? undefined,
            precio_campanya: producto.precio_campanya ?? undefined,
            lista_precio_activa: producto.lista_precio_activa || 'V',
            precio_mayorista: producto.precio_mayorista ?? undefined,
            precio_minorista: producto.precio_minorista ?? undefined,
            precio_evento: producto.precio_evento ?? undefined,
            precio_sin_iva: producto.precio_sin_iva ?? undefined,
            stock: producto.stock ?? 0,
            stock_min: producto.stock_min ?? undefined,
            stock_mayorista: producto.stock_mayorista ?? undefined,
            id_iva: producto.iva?.id_iva ?? undefined,
            estado: (producto.stock ?? 0) <= 0 ? 2 : (producto.estado ?? 1),
            publicado: producto.publicado ?? false,
            cuotas_habilitadas: producto.cuotas_habilitadas === true ? 'si' : producto.cuotas_habilitadas === false ? 'no' : 'regla',
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

    const { restaurarPreciosDesdeExcel, isRestaurando } = useRestaurarPreciosDesdeExcel();

    const validateStepOne = async () => {
        const fields = ['nombre'];
        return await form.trigger(fields as any);
    };

    const validateStepTwo = async () => {
        const fields = ['precio_venta', 'precio_especial', 'precio_pvp', 'precio_campanya', 'stock'];
        return await form.trigger(fields as any);
    };

    const validateStepThree = async () => {
        return true;
    };

    const handleComplete = async () => {
        const isValid = await form.trigger();

        if (!isValid) {
            return;
        }

        const rawData = form.getValues();

        // Preparar datos para el backend - precios por lista e IVA
        const data: any = {
            codi_arti: rawData.codi_arti,
            nombre: rawData.nombre,
            descripcion: rawData.descripcion,
            cod_sku: rawData.cod_sku,
            id_interno: rawData.id_interno,
            modelo: rawData.modelo?.trim() || null,
            precio_venta: rawData.precio_venta ?? undefined,
            precio_especial: rawData.precio_especial ?? undefined,
            precio_pvp: rawData.precio_pvp ?? undefined,
            precio_campanya: rawData.precio_campanya ?? undefined,
            lista_precio_activa: rawData.lista_precio_activa || undefined,
            precio_mayorista: rawData.precio_mayorista ?? undefined,
            precio_minorista: rawData.precio_minorista ?? undefined,
            precio_evento: rawData.precio_evento ?? undefined,
            precio_sin_iva: rawData.precio_sin_iva ?? undefined,
            stock: rawData.stock,
            stock_min: rawData.stock_min ?? undefined,
            stock_mayorista: rawData.stock_mayorista ?? undefined,
            codi_barras: rawData.codi_barras,
            unidad_medida: rawData.unidad_medida,
            unidades_por_producto: rawData.unidades_por_producto,
            img_principal: rawData.img_principal,
            imagenes: rawData.imagenes,
            destacado: rawData.destacado,
            financiacion: rawData.financiacion,
            estado: rawData.estado ? Number(rawData.estado) : undefined,
            codi_categoria: rawData.codi_categoria,
            codi_marca: rawData.codi_marca,
            codi_grupo: rawData.codi_grupo,
            codi_impuesto: rawData.codi_impuesto,
            publicado: rawData.publicado,
            cuotas_habilitadas: rawData.cuotas_habilitadas === 'si' ? true : rawData.cuotas_habilitadas === 'no' ? false : null,
            id_cat: rawData.id_cat ? Number(rawData.id_cat) : undefined,
            id_subcat: rawData.id_subcat ? Number(rawData.id_subcat) : undefined,
            id_marca: rawData.id_marca ? Number(rawData.id_marca) : undefined,
            id_iva: rawData.id_iva ? Number(rawData.id_iva) : undefined,
        };


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
                    content: <StepOneBasicInfo form={form} idProd={producto.id_prod} />,
                    onNext: validateStepOne,
                },
                {
                    title: 'Precios y Stock',
                    content: (
                        <div className="space-y-4">
                            <StepTwoPricing form={form} />
                            <div className="mt-4 pt-4 pb-6 border-t border-border">
                                <p className="text-sm text-muted-foreground mb-2">
                                    Si editaste precios manualmente y querés que vuelvan a tomarse del Excel/FTP en la próxima sincronización:
                                </p>
                                <Button
                                    type="button"
                                    variant="outline-primary"
                                    className="hover:scale-100"
                                    onClick={() => restaurarPreciosDesdeExcel(producto.id_prod)}
                                    disabled={isRestaurando}
                                >
                                    <FileSpreadsheet className="size-4 mr-2 shrink-0" />
                                    {isRestaurando ? 'Restaurando...' : 'Restaurar precios desde Excel'}
                                </Button>
                            </div>
                        </div>
                    ),
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
