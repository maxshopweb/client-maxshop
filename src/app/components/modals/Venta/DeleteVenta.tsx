import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import Textarea from '@/app/components/ui/Textarea';
import { useCancelarVenta } from '@/app/hooks/ventas/useVentasMutations';
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
    const [motivo, setMotivo] = useState('');
    const { cancelarVentaAsync, isCancelling } = useCancelarVenta({
        onSuccess: () => {
            onClose();
        },
    });

    const doAction = async () => {
        const motivoTrim = motivo.trim();
        await cancelarVentaAsync({
            id: venta.id_venta,
            motivo: motivoTrim || undefined,
        });
        onClose();
    };

    const handleConfirm = () => {
        if (onRequestPasswordConfirm) {
            onRequestPasswordConfirm(doAction);
        } else {
            void doAction();
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
                        disabled={isCancelling}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        variant="primary"
                        disabled={isCancelling}
                    >
                        {isCancelling ? 'Dando de baja...' : 'Dar de baja'}
                    </Button>
                </>
            )}
        >
            <p className="text-foreground mb-4">
                ¿Estás seguro de que deseas dar de baja la venta{' '}
                <span className="font-semibold">{getNumeroPedidoDisplay(venta.cod_interno, venta.id_venta) ?? `#${venta.id_venta}`}</span>?
                Esta acción marcará la venta como cancelada y enviará un email al cliente.
            </p>
            <Textarea
                label="Motivo (opcional)"
                placeholder="Ej. Sin stock, pago no recibido, solicitud del cliente..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={3}
            />
            <p className="text-xs text-muted-foreground mt-2">
                Si completás el motivo, se incluirá en el email de cancelación al cliente.
            </p>
            {onRequestPasswordConfirm && (
                <p className="text-xs text-muted-foreground mt-3">
                    Para continuar se pedirá tu contraseña.
                </p>
            )}
        </SimpleModal>
    );
}
