import TableSkeleton from '@/app/components/skeletons/TableProductSkeleton';

const TableUtilidadesSkeleton = () => {
    return (
        <div className="min-h-screen">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <div className="h-9 w-48 rounded animate-pulse bg-gray-200" />
                        <div className="mt-2 h-4 w-64 rounded animate-pulse bg-gray-100" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-24 rounded-full animate-pulse bg-gray-200" />
                        <div className="h-10 w-32 rounded-full animate-pulse bg-gray-200" />
                    </div>
                </div>
            </div>
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex gap-1 p-1 rounded-2xl border border-gray-200 bg-gray-50/50 w-full max-w-md">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 flex-1 rounded-xl animate-pulse bg-gray-200" />
                    ))}
                </div>
                <TableSkeleton columnCount={4} rowCount={6} />
            </div>
        </div>
    )
}

export default TableUtilidadesSkeleton;