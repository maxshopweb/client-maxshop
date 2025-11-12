export default function TableSkeleton() {
    return (
        <div className="w-full">
            <div className="rounded-lg bg-card border border-card p-4 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* HEADER */}
                        <thead className="bg-input border border-input p-4">
                            <tr>
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <th key={i} className="px-4 py-3 text-left">
                                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody className="divide-y divide-[var(--input-bg)]">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <tr key={i}>
                                    {Array.from({ length: 10 }).map((_, j) => (
                                        <td key={j} className="px-4 py-4 whitespace-nowrap">
                                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
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