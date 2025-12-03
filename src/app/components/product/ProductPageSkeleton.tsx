"use client";

export default function ProductPageSkeleton() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* Breadcrumbs Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-4 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-4 bg-gray-200 rounded" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gallery Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-lg" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="h-6 bg-gray-200 rounded w-24" />
          <div className="h-12 bg-gray-200 rounded w-40" />
          <div className="h-20 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <div className="flex gap-4 border-b border-gray-200">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="h-48 bg-gray-200 rounded" />
      </div>

      {/* Related Products Skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-64" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-[280px] space-y-2">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

