import { Trash2, X, Download } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { toast } from 'sonner';
import type { IVenta } from '@/app/types/ventas.type';

interface BulkActionsProps {
    selectedIds: number[];
    ventas: IVenta[];
    onClearSelection: () => void;
    onBulkDelete: (ids: number[]) => void;
    onBulkDownload: (ids: number[]) => void;
}

export function BulkActions({
    selectedIds,
    ventas,
    onClearSelection,
    onBulkDelete,
    onBulkDownload,
}: BulkActionsProps) {
    const selectedCount = selectedIds.length;

    const idsToDelete = selectedIds.filter(
        (id) => ventas.find((v) => v.id_venta === id)?.estado_pago !== 'cancelado'
    );
    const alreadyCancelledCount = selectedCount - idsToDelete.length;
    const canDeleteAny = idsToDelete.length > 0;

    const handleBulkDelete = () => {
        if (!canDeleteAny) {
            toast.info('Nada para dar de baja', {
                description: 'Las ventas seleccionadas ya están dadas de baja.',
            });
            return;
        }
        if (alreadyCancelledCount > 0) {
            toast.info('Algunas excluidas', {
                description: `${alreadyCancelledCount} venta(s) ya estaban dadas de baja y se excluyeron.`,
            });
        }
        onBulkDelete(idsToDelete);
    };

    return (
        <div className="bg-[var(--principal)] text-white px-4 py-3 rounded-lg shadow-lg flex flex-wrap items-center justify-between gap-3 min-w-0 w-full">
            <div className="flex flex-wrap items-center gap-3 min-w-0">
                <span className="font-medium shrink-0">
                    {selectedCount} venta{selectedCount !== 1 ? 's' : ''} seleccionada{selectedCount !== 1 ? 's' : ''}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        type="button"
                        onClick={() => onBulkDownload(selectedIds)}
                        variant="secondary"
                        size="sm"
                        className="!bg-white/20 !text-white hover:!bg-white/30 border-0 min-w-0 shrink-0"
                        title="Descargar CSV"
                    >
                        <Download className="w-4 h-4 shrink-0" />
                        <span className="text-sm whitespace-nowrap">Descargar</span>
                    </Button>
                    <Button
                        type="button"
                        onClick={handleBulkDelete}
                        variant="secondary"
                        size="sm"
                        className="!bg-white/20 !text-white hover:!bg-white/30 border-0 min-w-0 shrink-0"
                        title="Dar de baja seleccionadas"
                    >
                        <Trash2 className="w-4 h-4 shrink-0" />
                        <span className="text-sm whitespace-nowrap">Dar de baja</span>
                    </Button>
                </div>
            </div>
            <button
                type="button"
                onClick={onClearSelection}
                className="p-2 hover:bg-white/20 rounded transition-colors shrink-0"
                title="Limpiar selección"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
}

