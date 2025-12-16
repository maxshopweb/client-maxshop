import { useState, useCallback, useMemo } from 'react';
import type { ColumnSort, VisibilityState, RowSelectionState } from '@tanstack/react-table';

export type TableDensity = 'compact' | 'normal' | 'comfortable';

interface UseVentasTableOptions {
    enableRowSelection?: boolean;
    enableMultiRowSelection?: boolean;
    enableExpanding?: boolean;
    initialDensity?: TableDensity;
}

export function useVentasTable(options: UseVentasTableOptions = {}) {
    const {
        enableRowSelection = true,
        enableMultiRowSelection = true,
        enableExpanding = false,
        initialDensity = 'normal',
    } = options;

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const selectedIds = useMemo(() => {
        return Object.keys(rowSelection)
            .filter((key) => rowSelection[key])
            .map((key) => {
                const id = parseInt(key, 10);
                return isNaN(id) ? null : id;
            })
            .filter((id): id is number => id !== null);
    }, [rowSelection]);

    const selectedCount = selectedIds.length;

    const clearSelection = useCallback(() => {
        setRowSelection({});
    }, []);

    const selectAll = useCallback((ids: number[]) => {
        const newSelection: RowSelectionState = {};
        ids.forEach((id) => {
            newSelection[id] = true;
        });
        setRowSelection(newSelection);
    }, []);

    const toggleRow = useCallback((id: number) => {
        setRowSelection((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }, []);

    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const toggleRowExpanded = useCallback((id: number) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }, []);

    const collapseAll = useCallback(() => {
        setExpandedRows({});
    }, []);

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const toggleColumn = useCallback((columnId: string) => {
        setColumnVisibility((prev) => ({
            ...prev,
            [columnId]: !prev[columnId],
        }));
    }, []);

    const showAllColumns = useCallback(() => {
        setColumnVisibility({});
    }, []);

    const [columnOrder, setColumnOrder] = useState<string[]>([]);

    const [sorting, setSorting] = useState<ColumnSort[]>([]);

    const currentSort = useMemo(() => {
        if (sorting.length === 0) return null;
        return {
            column: sorting[0].id,
            direction: sorting[0].desc ? 'desc' : 'asc',
        };
    }, [sorting]);

    const [density, setDensity] = useState<TableDensity>(initialDensity);

    const densityClass = useMemo(() => {
        switch (density) {
            case 'compact':
                return 'py-1 text-xs';
            case 'comfortable':
                return 'py-4 text-base';
            default:
                return 'py-2 text-sm';
        }
    }, [density]);

    const isAllSelected = useCallback(
        (totalRows: number) => {
            return selectedCount === totalRows && totalRows > 0;
        },
        [selectedCount]
    );

    const isIndeterminate = useCallback(() => {
        return selectedCount > 0;
    }, [selectedCount]);

    const resetTable = useCallback(() => {
        clearSelection();
        collapseAll();
        setSorting([]);
    }, [clearSelection, collapseAll]);

    return {
        // Selección
        rowSelection,
        setRowSelection,
        selectedIds,
        selectedCount,
        clearSelection,
        selectAll,
        toggleRow,
        isAllSelected,
        isIndeterminate,

        // Expansión
        expandedRows,
        setExpandedRows,
        toggleRowExpanded,
        collapseAll,

        // Visibilidad
        columnVisibility,
        setColumnVisibility,
        toggleColumn,
        showAllColumns,

        // Orden de columnas
        columnOrder,
        setColumnOrder,

        // Ordenamiento
        sorting,
        setSorting,
        currentSort,

        // Densidad
        density,
        setDensity,
        densityClass,

        // Helpers
        resetTable,
    };
}

