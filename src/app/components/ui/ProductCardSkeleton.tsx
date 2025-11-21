export default function ProductCardSkeleton() {
  return (
    <div className="group relative bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl border border-input/50 p-4 md:p-6 transition-all duration-300 hover:border-principal/30 hover:shadow-lg animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full aspect-square mb-4 rounded-lg bg-input/50 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-input/30 to-input/10" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-3">
        {/* Brand Skeleton */}
        <div className="h-3 w-20 bg-input/50 rounded" />

        {/* Name Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-input/50 rounded" />
          <div className="h-4 w-3/4 bg-input/50 rounded" />
        </div>

        {/* Price Skeleton */}
        <div className="flex items-baseline gap-2">
          <div className="h-6 w-24 bg-input/50 rounded" />
        </div>

        {/* Button Skeleton */}
        <div className="h-10 w-full bg-input/50 rounded-lg mt-4" />
      </div>
    </div>
  );
}

