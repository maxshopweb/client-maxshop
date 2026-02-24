import { AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useUpdateVenta } from '@/app/hooks/ventas/useVentasMutations';
import type { IVenta } from '@/app/types/ventas.type';
import SimpleModal from '@/app/components/modals/SimpleModal';

interface DeleteVentaModalProps {
    venta: IVenta;
    onClose: () => void;
}

export function DeleteVentaModal({ venta, onClose }: DeleteVentaModalProps) {
    const { updateVenta, isUpdating } = useUpdateVenta({
        onSuccess: () => {
            onClose();
        },
    });

    const handleDelete = () => {
        // Soft delete: cambiar estado_pago a 'cancelado'
        updateVenta({
            id: venta.id_venta,
            data: {
                estado_pago: 'cancelado',
            }
        });
    };

    return (
        <SimpleModal
            isOpen={true}
            onClose={onClose}
            title={
                <span className="flex items-center gap-2">
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    </span>
                    Dar de baja venta
                </span>
            }
            maxWidth="max-w-md"
            actions={(handleClose) => (
                <>
                    <Button
                        onClick={handleClose}
                        variant="outline-primary"
                        disabled={isUpdating}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="primary"
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Dando de baja...' : 'Dar de Baja'}
                    </Button>
                </>
            )}
        >
            <p className="text-text mb-6">
                ¿Estás seguro de que deseas dar de baja la venta{' '}
                <span className="font-semibold">#{venta.id_venta}</span>?
                Esta acción marcará la venta como cancelada, pero no la eliminará permanentemente.
            </p>
        </SimpleModal>
    );
}

