import { Trash2, X } from 'lucide-react';
import { Button } from '../../ui/Button';

interface BulkActionsProps {
    selectedIds: number[];
    onClearSelection: () => void;
    onBulkDelete: (ids: number[]) => void;
}

export function BulkActions({ selectedIds, onClearSelection, onBulkDelete }: BulkActionsProps) {
    const selectedCount = selectedIds.length;

    return (
        <div className="bg-[var(--principal)] text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
                <span className="font-medium">
                    {selectedCount} venta{selectedCount !== 1 ? 's' : ''} seleccionada{selectedCount !== 1 ? 's' : ''}
                </span>

                <div className="flex items-center gap-2">
                    {/* Eliminar */}
                    <Button
                        onClick={() => onBulkDelete(selectedIds)}
                        title="Eliminar seleccionadas"
                        variant='secondary'
                    >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">Eliminar</span>
                    </Button>
                </div>
            </div>

            {/* Botón para limpiar selección */}
            <button
                onClick={onClearSelection}
                className="p-2 hover:bg-white/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Limpiar selección"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
}

