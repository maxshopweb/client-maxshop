import { UseFormReturn } from 'react-hook-form';
import Input from '@/app/components/ui/Input';
import { Package, Tag, FileText } from 'lucide-react';
import { useCategorias, useSubcategorias } from '@/app/hooks/categorias/useCategorias';
import { useMarcas } from '@/app/hooks/marcas/useMarcas';
import type { CreateProductoData } from '@/app/schemas/producto.schema';
import { ICategoria, ISubcategoria } from '@/app/types/categoria.type';
import { IMarca } from '@/app/types/marca.type';
import Select from '@/app/components/ui/Select';

interface StepOneProps {
    form: UseFormReturn<CreateProductoData>;
}

export function StepOneBasicInfo({ form }: StepOneProps) {
    const { register, watch, setValue, formState: { errors } } = form;

    const idCatSelected = watch('id_cat');

    const { data: categorias, isLoading: loadingCategorias } = useCategorias();
    const { data: subcategorias, isLoading: loadingSubcategorias } = useSubcategorias(idCatSelected);
    const { data: marcas, isLoading: loadingMarcas } = useMarcas();

    const categoriasList: ICategoria[] = Array.isArray(categorias?.data)
        ? categorias.data
        : categorias?.data
            ? [categorias.data]
            : [];

    const marcasList: IMarca[] = Array.isArray(marcas?.data)
        ? marcas.data
        : marcas?.data
            ? [marcas.data]
            : [];

    return (
        <div className="space-y-4 max-h-[350px] overflow-y-auto px-2">
            <h3 className="text-lg font-semibold text-input mb-4">
                Información básica del producto
            </h3>

            {/* FILA 1 */}
            <div className="grid grid-cols-2 gap-3">
                <Input
                    label="Codigo de articulo *"
                    placeholder="Ej: ART-001"
                    icon={Tag}
                    {...register('codi_arti')}
                    error={errors.codi_arti?.message}
                />
                <Input
                    label="Nombre del producto *"
                    placeholder="Ej: Taladro Inalámbrico 20V"
                    icon={Package}
                    {...register('nombre')}
                    error={errors.nombre?.message}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Input
                    label="Id interno"
                    placeholder="INT-001"
                    {...register('id_interno')}
                />
                <Input
                    label="Modelo"
                    placeholder="Ej: DCD771C2"
                    icon={FileText}
                    {...register('modelo')}
                />
            </div>

            <div className='grid grid-cols-2 gap-3'>
                <Input
                    label="Codigo sku"
                    placeholder="SKU-001"
                    {...register('cod_sku')}
                />
                <Input
                    label="Codigo de barras"
                    placeholder="1234567890123"
                    {...register('codi_barras')}
                />
            </div>

            <div className="grid grid-cols-3 gap-3">
                <Select
                    label="Categoria"
                    options={categoriasList.map((cat) => {
                        const optValue = (cat.codi_categoria && String(cat.codi_categoria).trim()) || (cat.id_cat != null ? String(cat.id_cat) : '');
                        return {
                            value: optValue || `cat-${cat.id_cat ?? ''}`,
                            label: `${cat.nombre || ''} ${cat.codi_categoria ? `(${cat.codi_categoria})` : ''}`.trim() || optValue
                        };
                    }).filter((o) => o.value)}
                    placeholder="Seleccionar"
                    disabled={loadingCategorias}
                    value={(() => {
                        const codi = watch('codi_categoria');
                        const idCat = watch('id_cat');
                        if (codi && String(codi).trim()) return String(codi).trim();
                        if (idCat != null && idCat !== '') return String(idCat);
                        return '';
                    })()}
                    onChange={(value) => {
                        const strVal = String(value);
                        const selectedCat = categoriasList.find((cat) =>
                            (cat.codi_categoria && String(cat.codi_categoria).trim() === strVal) ||
                            (cat.id_cat != null && String(cat.id_cat) === strVal)
                        );
                        if (selectedCat) {
                            setValue('codi_categoria', selectedCat.codi_categoria && String(selectedCat.codi_categoria).trim() ? selectedCat.codi_categoria : undefined, { shouldDirty: true });
                            setValue('id_cat', selectedCat.id_cat ?? undefined, { shouldDirty: true });
                        }
                        setValue('id_subcat', undefined, { shouldDirty: true });
                    }}
                />

                <Select
                    label="Subcategoria"
                    options={subcategorias?.data?.map((sub: ISubcategoria) => ({
                        value: sub.id_subcat != null ? String(sub.id_subcat) : '',
                        label: sub.nombre || ''
                    }))?.filter((o) => o.value) || []}
                    placeholder="Seleccionar"
                    disabled={!idCatSelected || loadingSubcategorias}
                    value={watch('id_subcat') != null && watch('id_subcat') !== '' ? String(watch('id_subcat')) : ''}
                    onChange={(value) => setValue('id_subcat', value !== '' ? Number(value) : undefined, { shouldDirty: true })}
                />

                <Select
                    label="Marca"
                    options={marcasList.map((marca) => {
                        const optValue = (marca.codi_marca && String(marca.codi_marca).trim()) || (marca.id_marca != null ? String(marca.id_marca) : '');
                        return {
                            value: optValue || `marca-${marca.id_marca ?? ''}`,
                            label: `${marca.nombre || ''} ${marca.codi_marca ? `(${marca.codi_marca})` : ''}`.trim() || optValue
                        };
                    }).filter((o) => o.value)}
                    placeholder="Seleccionar marca"
                    disabled={loadingMarcas}
                    value={(() => {
                        const codi = watch('codi_marca');
                        const idMar = watch('id_marca');
                        if (codi && String(codi).trim()) return String(codi).trim();
                        if (idMar != null && idMar !== '') return String(idMar);
                        return '';
                    })()}
                    onChange={(value) => {
                        const strVal = String(value);
                        const selectedMarca = marcasList.find((marca) =>
                            (marca.codi_marca && String(marca.codi_marca).trim() === strVal) ||
                            (marca.id_marca != null && String(marca.id_marca) === strVal)
                        );
                        if (selectedMarca) {
                            setValue('codi_marca', selectedMarca.codi_marca && String(selectedMarca.codi_marca).trim() ? selectedMarca.codi_marca : undefined, { shouldDirty: true });
                            setValue('id_marca', selectedMarca.id_marca ?? undefined, { shouldDirty: true });
                        }
                    }}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-input mb-1.5">
                    Descripcion
                </label>
                <textarea
                    {...register('descripcion')}
                    placeholder="Describe las características del producto..."
                    rows={3}
                    className="w-full px-3 py-2.5 bg-input border border-input rounded-2xl text-input text-sm focus:outline-none focus:ring-2 focus:ring-principal transition-all resize-none"
                />
            </div>
        </div>
    );
}
