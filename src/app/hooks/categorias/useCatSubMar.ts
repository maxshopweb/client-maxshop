import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { categoriaService } from '@/app/services/categoria.service';
import { marcaService } from '@/app/services/marca.service';
import type { ICreateCategoriaDTO, ICreateSubcategoriaDTO } from '@/app/types/categoria.type';
import type { ICreateMarcaDTO } from '@/app/types/marca.type';

// ========================================
// CATEGORIA
// ========================================
export function useCreateCategoria() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ICreateCategoriaDTO) => categoriaService.createCategria(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categorias'] });
            toast.success('Categoría creada exitosamente');
        },
        onError: (error: Error) => {
            toast.error('Error al crear categoría', {
                description: error.message
            });
        }
    });
}

// ========================================
// SUBCATEGORIA
// ========================================
export function useCreateSubcategoria() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ICreateSubcategoriaDTO) => categoriaService.createSubcategoria(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subcategorias'] });
            toast.success('Subcategoría creada exitosamente');
        },
        onError: (error: Error) => {
            toast.error('Error al crear subcategoría', {
                description: error.message
            });
        }
    });
}

// ========================================
// MARCA
// ========================================
export function useCreateMarca() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ICreateMarcaDTO) => marcaService.createMarca(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['marcas'] });
            toast.success('Marca creada exitosamente');
        },
        onError: (error: Error) => {
            toast.error('Error al crear marca', {
                description: error.message
            });
        }
    });
}