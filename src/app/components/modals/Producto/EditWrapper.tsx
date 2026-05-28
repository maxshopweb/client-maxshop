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
import {
    useUpdateProducto,
    useReanudarSincronizacionErp,
    useRestaurarProductoDesdeErp,
} from '@/app/hooks/productos/useProductosMutations';
import type { IProductos } from '@/app/types/producto.type';
import { Button } from '@/app/components/ui/Button';
import { TableBadge } from '@/app/components/ui/TableBadge';
import { Download, RefreshCw } from 'lucide-react';

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
            codi_impuesto: producto.codi_impuesto?.trim() || '01',
            codi_barras: producto.codi_barras || '',
            unidad_medida: producto.unidad_medida || '',
            unidades_por_producto: producto.unidades_por_producto || undefined,
            descripcion: producto.descripcion || '',
            id_cat: producto.id_cat ?? undefined,
            id_marca: producto.id_marca ?? undefined,
            destacado: Boolean(producto.destacado === true || (producto as { destacado?: boolean | number }).destacado === 1),
            financiacion: Boolean(producto.financiacion === true || (producto as { financiacion?: boolean | number }).financiacion === 1),
            precio_venta: producto.precio_venta ?? undefined,
            precio_especial: producto.precio_especial ?? undefined,
            precio_pvp: producto.precio_pvp ?? undefined,
            precio_campanya: producto.precio_campanya ?? undefined,
            precio_manual: (producto as { precio_manual?: number | null }).precio_manual ?? undefined,
            lista_precio_activa: producto.lista_precio_activa || 'V',
            bonificacion_porcentaje: producto.bonificacion_porcentaje ?? undefined,
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

    const { reanudarSincronizacionErp, isReanudando } = useReanudarSincronizacionErp();
    const { restaurarProductoDesdeErp, isRestaurandoDesdeErp } = useRestaurarProductoDesdeErp();

    const manualErp = producto.precio_editado_manualmente === true;
    const erpBusy = isReanudando || isRestaurandoDesdeErp;

    const handleActualizarDesdeErp = () => {
        if (
            !window.confirm(
                'Se conectará al FTP, se descargarán los datos y se aplicarán a este producto ahora. ¿Continuar?'
            )
        ) {
            return;
        }
        restaurarProductoDesdeErp(producto.id_prod);
    };

    const handleReanudarProximaSync = () => {
        if (
            !window.confirm(
                'Se quitará el bloqueo de sincronización FTP: stock y precios se actualizarán en la próxima importación automática (no ahora). ¿Continuar?'
            )
        ) {
            return;
        }
        reanudarSincronizacionErp(producto.id_prod);
    };

    const validateStepOne = async () => {
        const fields = ['nombre'];
        return await form.trigger(fields as any);
    };

    const validateStepTwo = async () => {
        const fields = ['precio_venta', 'precio_especial', 'precio_pvp', 'precio_campanya', 'precio_manual', 'stock'];
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
            precio_manual: (rawData.lista_precio_activa === 'E' || rawData.lista_precio_activa === 'e') ? (rawData.precio_manual ?? undefined) : undefined,
            lista_precio_activa: rawData.lista_precio_activa || undefined,
            bonificacion_porcentaje: rawData.bonificacion_porcentaje ?? undefined,
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
            id_cat: rawData.id_cat ? Number(rawData.id_cat) : undefined,
            id_marca: rawData.id_marca ? Number(rawData.id_marca) : undefined,
            id_iva: rawData.id_iva ? Number(rawData.id_iva) : undefined,
        };

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
                    content: (
                        <div className="space-y-3">
                            {manualErp && (
                                <div className="flex flex-wrap items-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-foreground">
                                    <TableBadge variant="warning">Manual</TableBadge>
                                    <span className="text-muted-foreground">
                                        Este producto está en modo manual: los datos del FTP no lo actualizan hasta que reanudes la sync o
                                        lo actualices desde FTP en el paso &quot;Precios&quot;.
                                    </span>
                                </div>
                            )}
                            <StepOneBasicInfo form={form} idProd={producto.id_prod} />
                        </div>
                    ),
                    onNext: validateStepOne,
                },
                {
                    title: 'Precios y Stock',
                    content: (
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                {manualErp ? (
                                    <TableBadge variant="warning">Manual</TableBadge>
                                ) : (
                                    <TableBadge variant="info">FTP</TableBadge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                    {manualErp
                                        ? 'Bloqueado para sync automática hasta reanudar o actualizar desde FTP.'
                                        : 'Recibe datos del FTP en cada sincronización automática.'}
                                </span>
                            </div>
                            <StepTwoPricing form={form} />
                            <div className="mt-4 pt-4 pb-2 border-t border-border space-y-3">
                                <p className="text-sm font-medium text-foreground">Sincronización con FTP</p>
                                <p className="text-sm text-muted-foreground">
                                    Actualización inmediata descarga el FTP y aplica datos a este producto. La opción ligera solo
                                    prepara el producto para la próxima sync FTP.
                                </p>
                                <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-stretch">
                                    <Button
                                        type="button"
                                        variant="primary"
                                        className="w-full min-h-11 min-w-0 shrink-0 justify-center whitespace-normal px-3 py-2.5 text-center leading-snug lg:flex-1 lg:min-w-[min(100%,280px)]"
                                        onClick={handleActualizarDesdeErp}
                                        disabled={erpBusy}
                                    >
                                        <Download className="size-4 mr-2 shrink-0" />
                                        <span>
                                            {isRestaurandoDesdeErp
                                                ? 'Actualizando…'
                                                : 'Actualizar este producto desde FTP'}
                                        </span>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline-primary"
                                        className="w-full min-h-11 min-w-0 shrink-0 justify-center whitespace-normal px-3 py-2.5 text-center leading-snug lg:flex-1 lg:min-w-[min(100%,220px)]"
                                        onClick={handleReanudarProximaSync}
                                        disabled={erpBusy}
                                    >
                                        <RefreshCw className={`size-4 mr-2 shrink-0 ${isReanudando ? 'animate-spin' : ''}`} />
                                        <span>{isReanudando ? 'Aplicando…' : 'Solo próxima sync FTP'}</span>
                                    </Button>
                                </div>
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
