import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProfileHeaderSkeleton() {

  return (
    <div className="bg-card rounded-xl shadow-sm border border-input p-4 sm:p-6">
      {/* Avatar y Nombre */}
      <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-input">
        <div className="relative mb-4">
          <Skeleton
            circle
            width={96}
            height={96}
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
            className="sm:w-24 sm:h-24"
          />
        </div>
        <div className="w-full max-w-[200px] mb-2">
          <Skeleton
            height={28}
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
            className="mb-1"
          />
        </div>
        <div className="w-full max-w-[120px] mb-2">
          <Skeleton
            height={16}
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
          />
        </div>
        <Skeleton
          height={24}
          width={100}
          baseColor="#d1d5db"
          highlightColor="#e5e7eb"
          className="rounded-full"
        />
      </div>

      {/* Información de contacto */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton
            circle
            width={36}
            height={36}
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
          />
          <div className="flex-1 min-w-0">
            <Skeleton
              height={12}
              width={60}
              baseColor="#d1d5db"
              highlightColor="#e5e7eb"
              className="mb-1"
            />
            <Skeleton
              height={16}
              width="80%"
              baseColor="#d1d5db"
              highlightColor="#e5e7eb"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Skeleton
            circle
            width={36}
            height={36}
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
          />
          <div className="flex-1 min-w-0">
            <Skeleton
              height={12}
              width={60}
              baseColor="#d1d5db"
              highlightColor="#e5e7eb"
              className="mb-1"
            />
            <Skeleton
              height={16}
              width="70%"
              baseColor="#d1d5db"
              highlightColor="#e5e7eb"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Skeleton
            circle
            width={36}
            height={36}
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
          />
          <div className="flex-1 min-w-0">
            <Skeleton
              height={12}
              width={60}
              baseColor="#d1d5db"
              highlightColor="#e5e7eb"
              className="mb-1"
            />
            <Skeleton
              height={16}
              width="60%"
              baseColor="#d1d5db"
              highlightColor="#e5e7eb"
            />
          </div>
        </div>
      </div>

      {/* Botón de cerrar sesión */}
      <div className="mt-6 pt-6 border-t border-input">
        <Skeleton
          height={40}
          baseColor="#d1d5db"
          highlightColor="#e5e7eb"
          className="w-full rounded-lg"
        />
      </div>
    </div>
  );
}

