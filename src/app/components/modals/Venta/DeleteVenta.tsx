import { AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { useUpdateVenta } from '@/app/hooks/ventas/useVentasMutations';
import type { IVenta } from '@/app/types/ventas.type';
import SimpleModal from '@/app/components/modals/SimpleModal';
import { getNumeroPedidoDisplay } from '@/app/utils/venta.utils';

interface DeleteVentaModalProps {
    venta: IVenta;
    onClose: () => void;
    /** Si se pasa, al confirmar "Dar de baja" se pide contraseña antes de ejecutar. */
    onRequestPasswordConfirm?: (perform: () => Promise<void>) => void;
}

export function DeleteVentaModal({ venta, onClose, onRequestPasswordConfirm }: DeleteVentaModalProps) {
    const { updateVenta, updateVentaAsync, isUpdating } = useUpdateVenta({
        onSuccess: () => {
            onClose();
        },
    });

    const doAction = async () => {
        await updateVentaAsync({
            id: venta.id_venta,
            data: { estado_pago: 'cancelado' },
        });
        onClose();
    };

    const handleConfirm = () => {
        if (onRequestPasswordConfirm) {
            onRequestPasswordConfirm(doAction);
        } else {
            updateVenta({
                id: venta.id_venta,
                data: { estado_pago: 'cancelado' },
            });
        }
    };

    return (
        <SimpleModal
            isOpen={true}
            onClose={onClose}
            title={
                <span className="flex items-center gap-2">
                    <span className="shrink-0 w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    </span>
                    Dar de baja venta
                </span>
            }
            maxWidth="max-w-md"
            actions={(handleClose) => (
                <>
                    <Button
                        type="button"
                        onClick={handleClose}
                        variant="ghost"
                        disabled={isUpdating}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        variant="primary"
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Dando de baja...' : 'Dar de baja'}
                    </Button>
                </>
            )}
        >
            <p className="text-foreground mb-6">
                ¿Estás seguro de que deseas dar de baja la venta{' '}
                <span className="font-semibold">{getNumeroPedidoDisplay(venta.cod_interno, venta.id_venta) ?? `#${venta.id_venta}`}</span>?
                Esta acción marcará la venta como cancelada. Para continuar se pedirá tu contraseña.
            </p>
        </SimpleModal>
    );
}

