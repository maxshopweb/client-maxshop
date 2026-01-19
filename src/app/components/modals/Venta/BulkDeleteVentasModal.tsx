import { AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useBulkDeleteVentas } from '@/app/hooks/ventas/useVentasMutations';

interface BulkDeleteVentasModalProps {
    ventaIds: number[];
    onClose: () => void;
}

export function BulkDeleteVentasModal({ ventaIds, onClose }: BulkDeleteVentasModalProps) {
    const { bulkDelete, isDeleting } = useBulkDeleteVentas({
        onSuccess: () => {
            onClose();
        },
    });

    const handleDelete = () => {
        bulkDelete(ventaIds);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card rounded-lg shadow-xl border border-card p-6 max-w-md w-full mx-4">
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-text">
                            Dar de Baja Ventas
                        </h3>
                        <p className="text-sm text-gray-500">
                            Las ventas serán marcadas como canceladas
                        </p>
                    </div>
                </div>

                <p className="text-text mb-6">
                    ¿Estás seguro de que deseas dar de baja{' '}
                    <span className="font-semibold">{ventaIds.length}</span> venta(s)?
                    Esta acción marcará las ventas como canceladas, pero no las eliminará permanentemente.
                </p>

                <div className="flex gap-3 justify-end">
                    <Button
                        onClick={onClose}
                        variant="secondary"
                        disabled={isDeleting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="danger"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Dando de baja...' : 'Dar de Baja'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

