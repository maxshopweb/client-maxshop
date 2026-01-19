const AddressCardSkeleton = () => {
    return (
        <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-background border-input">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-5 w-32 bg-foreground/10 rounded animate-pulse" />
                            <div className="h-5 w-16 bg-foreground/10 rounded animate-pulse" />
                        </div>
                        <div className="h-4 w-64 bg-foreground/10 rounded animate-pulse mb-1" />
                        <div className="h-4 w-48 bg-foreground/10 rounded animate-pulse" />
                    </div>
                    <div className="flex gap-2 ml-4">
                        <div className="h-8 w-8 bg-foreground/10 rounded animate-pulse" />
                        <div className="h-8 w-8 bg-foreground/10 rounded animate-pulse" />
                        <div className="h-8 w-8 bg-foreground/10 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddressCardSkeleton;