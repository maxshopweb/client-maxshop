import { useDeleteProducto } from '@/app/hooks/productos/useProductosMutations';
import ConfirmModal from '@/app/components/modals/ConfirmModal';
import type { IProductos } from '@/app/types/producto.type';

interface DeleteProductoModalProps {
    producto: IProductos;
    onClose: () => void;
}

export function DeleteProductoModal({ producto, onClose }: DeleteProductoModalProps) {
    const { deleteProducto, isDeleting } = useDeleteProducto({
        onSuccess: () => {
            onClose();
        }
    });

    const handleConfirm = () => {
        deleteProducto(producto.id_prod);
    };

    return (
        <ConfirmModal
            isOpen={true}
            onClose={onClose}
            onConfirm={handleConfirm}
            title="¿Eliminar producto?"
            description={`¿Estás seguro que deseas eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`}
            type="error"
            confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
            cancelText="Cancelar"
        />
    );
}