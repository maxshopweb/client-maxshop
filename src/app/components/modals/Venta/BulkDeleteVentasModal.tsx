import { AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { useBulkDeleteVentas } from '@/app/hooks/ventas/useVentasMutations';
import ModalBase from '@/app/components/modals/BaseModal';

interface BulkDeleteVentasModalProps {
    ventaIds: number[];
    onClose: () => void;
    isOpen?: boolean;
    /** Si se pasa, al confirmar se pide contraseña antes de ejecutar. */
    onRequestPasswordConfirm?: (perform: () => Promise<void>) => void;
}

export function BulkDeleteVentasModal({
    ventaIds,
    onClose,
    isOpen = true,
    onRequestPasswordConfirm,
}: BulkDeleteVentasModalProps) {
    const { bulkDelete, bulkDeleteAsync, isDeleting } = useBulkDeleteVentas({
        onSuccess: () => {
            onClose();
        },
    });

    const doAction = async () => {
        await bulkDeleteAsync(ventaIds);
        onClose();
    };

    const handleConfirm = () => {
        if (onRequestPasswordConfirm) {
            onRequestPasswordConfirm(doAction);
        } else {
            bulkDelete(ventaIds);
        }
    };

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="max-w-md"
            showCloseButton={true}
        >
            {({ handleClose }) => (
                <div className="flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-4 p-6 pb-4 border-b border-border">
                        <div className="shrink-0 w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center ring-2 ring-red-500/20">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground tracking-tight">
                                Dar de baja ventas
                            </h2>
                            <p className="text-sm text-foreground/60 mt-0.5">
                                Las ventas quedarán marcadas como canceladas
                            </p>
                        </div>
                    </div>

                    {/* Cuerpo */}
                    <div className="p-6 space-y-4">
                        <p className="text-foreground text-base leading-relaxed">
                            ¿Estás seguro de que querés dar de baja{' '}
                            <span className="font-semibold text-foreground inline-flex items-center px-1.5 py-0.5 rounded bg-foreground/10">
                                {ventaIds.length} {ventaIds.length === 1 ? 'venta' : 'ventas'}
                            </span>
                            ?
                        </p>
                        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                            <p className="text-sm text-foreground/80 leading-relaxed">
                                Esta acción no elimina las ventas de la base de datos. Solo se actualizará su estado a &quot;cancelado&quot; y dejarán de mostrarse como activas.
                            </p>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-3 justify-end px-6 py-4 bg-foreground/[0.02] border-t border-border rounded-b-md">
                        <Button
                            type="button"
                            onClick={handleClose}
                            variant="ghost"
                            disabled={isDeleting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirm}
                            variant="primary"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Dando de baja...' : 'Dar de baja'}
                        </Button>
                    </div>
                </div>
            )}
        </ModalBase>
    );
}

