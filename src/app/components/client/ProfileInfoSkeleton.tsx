import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProfileCard from "./ProfileCard";
import { User } from "lucide-react";

export default function ProfileInfoSkeleton() {

  return (
    <ProfileCard title="Información personal" icon={User}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Nombre */}
        <div>
          <Skeleton
            height={14}
            width={80}
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
            className="mb-1.5"
          />
          <div className="flex items-center gap-2 p-3 bg-background rounded-lg border border-input">
            <Skeleton
              circle
              width={16}
              height={16}
              baseColor="#d1d5db"
              highlightColor="#e5e7eb"
            />
            <Skeleton
              height={16}
              width="70%"
              baseColor="#d1d5db"
              highlightColor="#e5e7eb"
            />
          </div>
        </div>

        {/* Apellido */}
        <div>
          <Skeleton
            height={14}
            width={80}
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
            className="mb-1.5"
          />
          <div className="flex items-center gap-2 p-3 bg-background rounded-lg border border-input">
            <Skeleton
              circle
              width={16}
              height={16}
              baseColor="#d1d5db"
              highlightColor="#e5e7eb"
            />
            <Skeleton
              height={16}
              width="70%"
              baseColor="#d1d5db"
              highlightColor="#e5e7eb"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <Skeleton
            height={14}
            width={80}
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
            className="mb-1.5"
          />
          <div className="flex items-center gap-2 p-3 bg-background rounded-lg border border-input">
            <Skeleton
              circle
              width={16}
              height={16}
              baseColor="#d1d5db"
              highlightColor="#e5e7eb"
            />
            <Skeleton
              height={16}
              width="80%"
              baseColor="#d1d5db"
              highlightColor="#e5e7eb"
            />
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <Skeleton
            height={14}
            width={80}
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
            className="mb-1.5"
          />
          <div className="flex items-center gap-2 p-3 bg-background rounded-lg border border-input">
            <Skeleton
              circle
              width={16}
              height={16}
              baseColor="#d1d5db"
              highlightColor="#e5e7eb"
            />
            <Skeleton
              height={16}
              width="60%"
              baseColor="#d1d5db"
              highlightColor="#e5e7eb"
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <Skeleton
            height={14}
            width={80}
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
            className="mb-1.5"
          />
          <div className="flex items-center gap-2 p-3 bg-background rounded-lg border border-input">
            <Skeleton
              circle
              width={16}
              height={16}
              baseColor="#d1d5db"
              highlightColor="#e5e7eb"
            />
            <Skeleton
              height={16}
              width="50%"
              baseColor="#d1d5db"
              highlightColor="#e5e7eb"
            />
          </div>
        </div>

        {/* Fecha de nacimiento */}
        <div>
          <Skeleton
            height={14}
            width={120}
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
            className="mb-1.5"
          />
          <div className="flex items-center gap-2 p-3 bg-background rounded-lg border border-input">
            <Skeleton
              circle
              width={16}
              height={16}
              baseColor="#d1d5db"
              highlightColor="#e5e7eb"
            />
            <Skeleton
              height={16}
              width="40%"
              baseColor="#d1d5db"
              highlightColor="#e5e7eb"
            />
          </div>
        </div>
      </div>

      {/* Botón de editar */}
      <div className="pt-4 border-t border-input mt-4">
        <Skeleton
          height={40}
          width={200}
          baseColor="#d1d5db"
          highlightColor="#e5e7eb"
          className="rounded-lg"
        />
      </div>
    </ProfileCard>
  );
}
