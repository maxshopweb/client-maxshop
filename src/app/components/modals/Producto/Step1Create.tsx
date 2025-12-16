import { UseFormReturn } from 'react-hook-form';
import Input from '@/app/components/ui/Input';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check, Package, Tag, FileText } from 'lucide-react';
import { useCategorias, useSubcategorias } from '@/app/hooks/categorias/useCategorias';
import { useMarcas } from '@/app/hooks/marcas/useMarcas';
import { useCreateCategoria, useCreateSubcategoria, useCreateMarca } from '../../../hooks/categorias/useCatSubMar';
import type { CreateProductoData } from '@/app/schemas/producto.schema';
import { ICategoria, ISubcategoria } from '@/app/types/categoria.type';
import { IMarca } from '@/app/types/marca.type';
import SelectWithCreate from '@/app/components/ui/SelectWithCreate';

interface StepOneProps {
    form: UseFormReturn<CreateProductoData>;
}

export function StepOneBasicInfo({ form }: StepOneProps) {
    const { register, watch, setValue, formState: { errors } } = form;

    const idCatSelected = watch('id_cat');

    const { data: categorias, isLoading: loadingCategorias } = useCategorias();
    const { data: subcategorias, isLoading: loadingSubcategorias } = useSubcategorias(idCatSelected);
    const { data: marcas, isLoading: loadingMarcas } = useMarcas();
    
    const createCategoria = useCreateCategoria();
    const createSubcategoria = useCreateSubcategoria();
    const createMarca = useCreateMarca();

    return (
        <div className="space-y-4 max-h-[350px] overflow-y-auto px-2">
            <h3 className="text-lg font-semibold text-input mb-4">
                Información Básica del Producto
            </h3>

            {/* FILA 1 */}
            <div className="grid grid-cols-2 gap-3">
                <Input
                    label="Código de Artículo *"
                    placeholder="Ej: ART-001"
                    icon={Tag}
                    {...register('codi_arti')}
                    error={errors.codi_arti?.message}
                />
                <Input
                    label="Nombre del Producto *"
                    placeholder="Ej: Taladro Inalámbrico 20V"
                    icon={Package}
                    {...register('nombre')}
                    error={errors.nombre?.message}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Input
                    label="ID Interno"
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
                    label="Código SKU"
                    placeholder="SKU-001"
                    {...register('cod_sku')}
                />
                <Input
                    label="Código de Barras"
                    placeholder="1234567890123"
                    {...register('codi_barras')}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <SelectWithCreate
                    label="Categoría"
                    options={categorias?.data?.map((cat: ICategoria) => ({
                        value: cat.codi_categoria || cat.id_cat?.toString() || '',
                        label: `${cat.nombre || ''} ${cat.codi_categoria ? `(${cat.codi_categoria})` : ''}`
                    })) || []}
                    placeholder="Seleccionar"
                    disabled={loadingCategorias}
                    canCreate
                    createLabel="+ Crear Categoría"
                    onCreateSubmit={createCategoria.mutateAsync}
                    isCreating={createCategoria.isPending}
                    {...register('codi_categoria')}
                    onChange={(e) => {
                        const selectedCat = categorias?.data?.find((cat: ICategoria) => 
                            cat.codi_categoria === e.target.value || cat.id_cat?.toString() === e.target.value
                        );
                        if (selectedCat) {
                            setValue('codi_categoria', selectedCat.codi_categoria || undefined);
                            setValue('id_cat', selectedCat.id_cat || undefined);
                        }
                        setValue('id_subcat', undefined);
                    }}
                />

                <SelectWithCreate
                    label="Subcategoría"
                    options={subcategorias?.data?.map((sub: ISubcategoria) => ({
                        value: sub.id_subcat,
                        label: sub.nombre || ''
                    })) || []}
                    placeholder="Seleccionar"
                    disabled={!idCatSelected || loadingSubcategorias}
                    canCreate
                    createLabel="+ Crear Subcategoría"
                    onCreateSubmit={createSubcategoria.mutateAsync}
                    isCreating={createSubcategoria.isPending}
                    needsParent
                    parentId={Number(idCatSelected)}
                    parentLabel="una categoría"
                    {...register('id_subcat')}
                />
            </div>

            <div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-input mb-1.5">
                        Descripción
                    </label>
                    <textarea
                        {...register('descripcion')}
                        placeholder="Describe las características del producto..."
                        rows={3}
                        className="w-full px-3 py-2.5 bg-input border border-input rounded-2xl text-input text-sm focus:outline-none focus:ring-2 focus:ring-principal transition-all resize-none"
                    />
                </div>
            </div>

            {/* FILA 3: Marca y Checkboxes */}
            <div className="grid grid-cols-2 gap-6">
                <SelectWithCreate
                    label="Marca"
                    options={marcas?.data?.map((marca: IMarca) => ({
                        value: marca.codi_marca || marca.id_marca?.toString() || '',
                        label: `${marca.nombre || ''} ${marca.codi_marca ? `(${marca.codi_marca})` : ''}`
                    })) || []}
                    placeholder="Seleccionar marca"
                    disabled={loadingMarcas}
                    canCreate
                    createLabel="+ Crear Marca"
                    onCreateSubmit={createMarca.mutateAsync}
                    isCreating={createMarca.isPending}
                    {...register('codi_marca')}
                    onChange={(e) => {
                        const selectedMarca = marcas?.data?.find((marca: IMarca) => 
                            marca.codi_marca === e.target.value || marca.id_marca?.toString() === e.target.value
                        );
                        if (selectedMarca) {
                            setValue('codi_marca', selectedMarca.codi_marca || undefined);
                            setValue('id_marca', selectedMarca.id_marca || undefined);
                        }
                    }}
                />

                {/* Checkboxes */}
                <div className="flex items-center gap-6 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <Checkbox.Root
                            checked={watch('destacado') || false}
                            onCheckedChange={(checked) => setValue('destacado', checked as boolean)}
                            className="flex h-5 w-5 items-center justify-center rounded border-2 border-input group-hover:border-principal data-[state=checked]:bg-principal data-[state=checked]:border-principal transition-all"
                        >
                            <Checkbox.Indicator>
                                <Check className="h-3.5 w-3.5 text-white" />
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                        <span className="text-sm text-input group-hover:text-principal transition-colors whitespace-nowrap">
                            Destacado
                        </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer group">
                        <Checkbox.Root
                            checked={watch('financiacion') || false}
                            onCheckedChange={(checked) => setValue('financiacion', checked as boolean)}
                            className="flex h-5 w-5 items-center justify-center rounded border-2 border-input group-hover:border-principal data-[state=checked]:bg-principal data-[state=checked]:border-principal transition-all"
                        >
                            <Checkbox.Indicator>
                                <Check className="h-3.5 w-3.5 text-white" />
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                        <span className="text-sm text-input group-hover:text-principal transition-colors whitespace-nowrap">
                            Financiación
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
}