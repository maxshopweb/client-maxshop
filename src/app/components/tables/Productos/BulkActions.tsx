import { Trash2, Power, PowerOff, Globe, GlobeLock, X, CreditCard, Ban, RefreshCw, Download } from 'lucide-react';
import { useBulkUpdateEstado } from '@/app/hooks/productos/useProductosMutations';
import { useBulkSetPublicado, useBulkUpdateCuotas } from '@/app/hooks/productos/usePublicadoMutations';
import { Button } from '../../ui/Button';

interface BulkActionsProps {
    selectedIds: number[];
    onClearSelection: () => void;
    onBulkDelete: (ids: number[]) => void;
    onBulkReanudarErp?: (ids: number[]) => void;
    onBulkRestaurarDesdeErp?: (ids: number[]) => void;
    isBulkReanudandoErp?: boolean;
    isBulkRestaurandoDesdeErp?: boolean;
}

export function BulkActions({
    selectedIds,
    onClearSelection,
    onBulkDelete,
    onBulkReanudarErp,
    onBulkRestaurarDesdeErp,
    isBulkReanudandoErp,
    isBulkRestaurandoDesdeErp,
}: BulkActionsProps) {
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

    const { bulkUpdateCuotas, isUpdating: isBulkUpdatingCuotas } = useBulkUpdateCuotas({
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

    const handleFinanciacionHabilitar = () => {
        bulkUpdateCuotas({ ids: selectedIds, cuotas_habilitadas: true });
    };
    const handleFinanciacionDeshabilitar = () => {
        bulkUpdateCuotas({ ids: selectedIds, cuotas_habilitadas: false });
    };

    const isLoadingCore =
        isBulkUpdatingEstado || isBulkUpdatingPublicado || isBulkUpdatingCuotas;
    const isLoadingErp = Boolean(isBulkReanudandoErp || isBulkRestaurandoDesdeErp);
    const isLoading = isLoadingCore || isLoadingErp;

    return (
        <div className="bg-[var(--principal)] text-white px-3 py-3 sm:px-4 rounded-lg shadow-lg flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-2 min-w-0 flex-1">
                <span className="font-medium text-sm sm:text-base shrink-0">
                    {selectedCount} producto{selectedCount !== 1 ? 's' : ''} seleccionado
                    {selectedCount !== 1 ? 's' : ''}
                </span>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <Button
                        onClick={handleActivar}
                        disabled={isLoading}
                        title="Activar seleccionados"
                        variant="secondary"
                        className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                    >
                        <Power className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="sm:inline">Activar</span>
                    </Button>

                    <Button
                        onClick={handleDesactivar}
                        disabled={isLoading}
                        title="Desactivar seleccionados"
                        variant="secondary"
                        className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                    >
                        <PowerOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Desactivar</span>
                    </Button>

                    <Button
                        onClick={handlePublicar}
                        disabled={isLoading}
                        title="Publicar en tienda"
                        variant="secondary"
                        className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                    >
                        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Publicar</span>
                    </Button>
                    <Button
                        onClick={handleDespublicar}
                        disabled={isLoading}
                        title="Despublicar de tienda"
                        variant="secondary"
                        className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                    >
                        <GlobeLock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Ocultar</span>
                    </Button>

                    <Button
                        onClick={handleFinanciacionHabilitar}
                        disabled={isLoading}
                        title="Habilitar financiación"
                        variant="secondary"
                        className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                    >
                        <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden md:inline">Con financiación</span>
                        <span className="md:hidden">+financ.</span>
                    </Button>
                    <Button
                        onClick={handleFinanciacionDeshabilitar}
                        disabled={isLoading}
                        title="Deshabilitar financiación"
                        variant="secondary"
                        className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                    >
                        <Ban className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden md:inline">Sin financiación</span>
                        <span className="md:hidden">−financ.</span>
                    </Button>

                    {onBulkReanudarErp && (
                        <Button
                            onClick={() => onBulkReanudarErp(selectedIds)}
                            disabled={isLoading}
                            title="Reanudar sync FTP: la próxima importación aplicará a estos productos"
                            variant="secondary"
                            className="h-8 px-2 sm:px-3 text-xs sm:text-sm border-white/30"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isBulkReanudandoErp ? 'animate-spin' : ''}`} />
                            <span className="hidden min-[480px]:inline">Próx. sync</span>
                            <span className="min-[480px]:hidden">Sync</span>
                        </Button>
                    )}

                    {onBulkRestaurarDesdeErp && (
                        <Button
                            onClick={() => onBulkRestaurarDesdeErp(selectedIds)}
                            disabled={isLoading}
                            title="Descargar FTP y aplicar a cada producto (lento si hay muchos)"
                            variant="secondary"
                            className="h-8 px-2 sm:px-3 text-xs sm:text-sm border-amber-200/50 bg-white/15"
                        >
                            <Download className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isBulkRestaurandoDesdeErp ? 'animate-pulse' : ''}`} />
                            <span className="hidden min-[520px]:inline">Desde FTP</span>
                            <span className="min-[520px]:hidden">FTP</span>
                        </Button>
                    )}

                    <Button
                        onClick={() => onBulkDelete(selectedIds)}
                        disabled={isLoading}
                        title="Eliminar seleccionados"
                        variant="secondary"
                        className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                    >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Eliminar</span>
                    </Button>
                </div>
            </div>

            <button
                onClick={onClearSelection}
                disabled={isLoading}
                className="self-end sm:self-start p-2 hover:bg-white/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                title="Limpiar selección"
                type="button"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
}
