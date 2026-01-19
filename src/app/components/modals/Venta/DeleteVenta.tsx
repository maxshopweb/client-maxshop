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
            title="Dar de baja venta"
            maxWidth="max-w-md"
            actions={(handleClose) => (
                <>
                    <Button
                        onClick={handleClose}
                        variant="secondary"
                        disabled={isUpdating}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="danger"
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Dando de baja...' : 'Dar de Baja'}
                    </Button>
                </>
            )}
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-text">
                        Dar de Baja Venta
                    </h3>
                    <p className="text-sm text-gray-500">
                        La venta será marcada como cancelada
                    </p>
                </div>
            </div>

            <p className="text-text mb-6">
                ¿Estás seguro de que deseas dar de baja la venta{' '}
                <span className="font-semibold">#{venta.id_venta}</span>?
                Esta acción marcará la venta como cancelada, pero no la eliminará permanentemente.
            </p>
        </SimpleModal>
    );
}

