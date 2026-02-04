interface TableProductSkeletonProps {
    /** Número de columnas (default: 10, ej. 4 para tablas tipo maestros) */
    columnCount?: number;
    /** Número de filas (default: 6) */
    rowCount?: number;
}

export default function TableProductSkeleton({ columnCount = 10, rowCount = 6 }: TableProductSkeletonProps = {}) {
    return (
        <div className="w-full">
            <div className="bg-card border border-card rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                {Array.from({ length: columnCount }).map((_, i) => (
                                    <th key={i} className="px-4 py-3 text-left">
                                        <div className="h-4 rounded animate-pulse bg-gray-200" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Array.from({ length: rowCount }).map((_, i) => (
                                <tr key={i}>
                                    {Array.from({ length: columnCount }).map((_, j) => (
                                        <td key={j} className="px-4 py-4 whitespace-nowrap">
                                            <div className="h-4 rounded animate-pulse bg-gray-100" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}