'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ModalBase from '@/app/components/modals/BaseModal';
import { ProductoImagenesEditor } from './ProductoImagenesEditor';
import { uploadService } from '@/app/services/upload.service';
import { productosService } from '@/app/services/producto.service';
import { productosKeys } from '@/app/hooks/productos/useProductos';
import type { IProductos } from '@/app/types/producto.type';

interface CambiarImagenModalProps {
    product: IProductos;
    onClose: () => void;
}

export function CambiarImagenModal({ product, onClose }: CambiarImagenModalProps) {
    const queryClient = useQueryClient();
    const [mainFile, setMainFile] = useState<File | null>(null);
    const [secondaryFiles, setSecondaryFiles] = useState<File[]>([]);
    const [existingSecondaryPaths, setExistingSecondaryPaths] = useState<string[]>(
        Array.isArray(product.imagenes) ? [...product.imagenes] : []
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            const idProd = product.id_prod;
            let mainPath = product.img_principal ?? undefined;

            if (mainFile) {
                const res = await uploadService.uploadProductImage(idProd, mainFile);
                mainPath = res.path;
            }

            const newPaths: string[] = [];
            for (const file of secondaryFiles) {
                const res = await uploadService.uploadProductSecondaryImage(idProd, file);
                newPaths.push(res.path);
            }

            const finalImagenes = [...existingSecondaryPaths, ...newPaths];

            await productosService.update(idProd, {
                img_principal: mainPath,
                imagenes: finalImagenes.length ? finalImagenes : undefined,
            });

            queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productosKeys.detail(idProd) });
            queryClient.invalidateQueries({ queryKey: productosKeys.destacados() });
            queryClient.invalidateQueries({ queryKey: productosKeys.stockBajo() });

            toast.success('Imágenes actualizadas');
            onClose();
        } catch (error: any) {
            toast.error('Error al guardar imágenes', {
                description: error?.message ?? 'Intente de nuevo.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalBase isOpen={true} onClose={onClose} maxWidth="max-w-2xl">
            {({ handleClose }) => (
                <div className="py-6 px-6 animate-bounce-in">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                            Cambiar imágenes
                        </h2>
                        {product.nombre && (
                            <p className="text-sm text-input/70 mt-1 truncate">{product.nombre}</p>
                        )}
                    </div>

                    <div className="max-h-[65vh] overflow-y-auto pr-1">
                        <ProductoImagenesEditor
                            mode="edit"
                            product={product}
                            mainFile={mainFile}
                            setMainFile={setMainFile}
                            secondaryFiles={secondaryFiles}
                            setSecondaryFiles={setSecondaryFiles}
                            existingSecondaryPaths={existingSecondaryPaths}
                            setExistingSecondaryPaths={setExistingSecondaryPaths}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-input/40">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2.5 rounded-xl border border-input text-input hover:bg-input/20 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 rounded-xl bg-principal text-white hover:opacity-90 disabled:opacity-50 transition-opacity font-medium shadow-sm"
                        >
                            {isSubmitting ? 'Guardando…' : 'Guardar'}
                        </button>
                    </div>
                </div>
            )}
        </ModalBase>
    );
}
