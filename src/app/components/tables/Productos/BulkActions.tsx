import { Trash2, Power, PowerOff, Globe, GlobeLock, X } from 'lucide-react';
import { useBulkUpdateEstado } from '@/app/hooks/productos/useProductosMutations';
import { useBulkSetPublicado } from '@/app/hooks/productos/usePublicadoMutations';
import { Button } from '../../ui/Button';

interface BulkActionsProps {
    selectedIds: number[];
    onClearSelection: () => void;
    onBulkDelete: (ids: number[]) => void;
}

export function BulkActions({ selectedIds, onClearSelection, onBulkDelete }: BulkActionsProps) {
    const { bulkUpdateEstado, isUpdating: isBulkUpdatingEstado } = useBulkUpdateEstado({
        onSuccess: () => {
            onClearSelection();
        },
    });

    const { bulkSetPublicado, isUpdating: isBulkUpdatingPublicado } = useBulkSetPublicado({
        onSuccess: () => {
            onClearSelection();
        },
    });

    const selectedCount = selectedIds.length;

    const handleActivar = () => {
        bulkUpdateEstado({ ids: selectedIds, estado: 1 });
    };

    const handleDesactivar = () => {
        bulkUpdateEstado({ ids: selectedIds, estado: 2 });
    };

    const handlePublicar = () => {
        bulkSetPublicado({ ids: selectedIds, publicado: true });
    };

    const handleDespublicar = () => {
        bulkSetPublicado({ ids: selectedIds, publicado: false });
    };

    const isLoading = isBulkUpdatingEstado || isBulkUpdatingPublicado;

    return (
        <div className="bg-[var(--principal)] text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
                <span className="font-medium">
                    {selectedCount} producto{selectedCount !== 1 ? 's' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
                </span>

                <div className="flex items-center gap-2">
                    {/* Activar */}
                    <Button
                        onClick={handleActivar}
                        disabled={isLoading}
                        title="Activar seleccionados"
                        variant='secondary'
                    >
                        <Power className="w-4 h-4" />
                        <span className="text-sm">Activar</span>
                    </Button>

                    {/* Desactivar */}
                    <Button
                        onClick={handleDesactivar}
                        disabled={isLoading}
                        title="Desactivar seleccionados"
                        variant='secondary'
                    >
                        <PowerOff className="w-4 h-4" />
                        <span className="text-sm">Desactivar</span>
                    </Button>

                    {/* Publicar / Despublicar */}
                    <Button
                        onClick={handlePublicar}
                        disabled={isLoading}
                        title="Publicar en tienda"
                        variant='secondary'
                    >
                        <Globe className="w-4 h-4" />
                        <span className="text-sm">Publicar</span>
                    </Button>
                    <Button
                        onClick={handleDespublicar}
                        disabled={isLoading}
                        title="Despublicar de tienda"
                        variant='secondary'
                    >
                        <GlobeLock className="w-4 h-4" />
                        <span className="text-sm">Despublicar</span>
                    </Button>

                    {/* Eliminar */}
                    <Button
                        onClick={() => onBulkDelete(selectedIds)}
                        disabled={isLoading}
                        title="Eliminar seleccionados"
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
                disabled={isLoading}
                className="p-2 hover:bg-white/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Limpiar selección"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
}