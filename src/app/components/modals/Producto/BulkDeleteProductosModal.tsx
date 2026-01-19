import { useBulkDeleteProductos } from '@/app/hooks/productos/useProductosMutations';
import ConfirmModal from '@/app/components/modals/ConfirmModal';

interface BulkDeleteProductosModalProps {
    productIds: number[];
    onClose: () => void;
}

export function BulkDeleteProductosModal({ productIds, onClose }: BulkDeleteProductosModalProps) {
    const { bulkDelete, isDeleting } = useBulkDeleteProductos({
        onSuccess: () => onClose()
    });

    return (
        <ConfirmModal
            isOpen={true}
            onClose={onClose}
            onConfirm={() => bulkDelete(productIds)}
            title="¿Eliminar productos seleccionados?"
            description={`¿Estás seguro que deseas eliminar ${productIds.length} producto(s)? Esta acción no se puede deshacer.`}
            type="error"
            confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
            cancelText="Cancelar"
        />
    );
}
