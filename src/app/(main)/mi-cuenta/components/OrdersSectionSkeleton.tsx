import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProfileCard from "./ProfileCard";
import { Package } from "lucide-react";

export default function OrdersSectionSkeleton() {

  return (
    <ProfileCard title="Mis Pedidos" icon={Package}>
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
        <Skeleton
          circle
          width={80}
          height={80}
          baseColor="var(--skeleton-base)"
          highlightColor="var(--skeleton-highlight)"
          className="mb-4"
        />
        <Skeleton
          height={24}
          width={200}
          baseColor="var(--skeleton-base)"
          highlightColor="var(--skeleton-highlight)"
          className="mb-2"
        />
        <Skeleton
          height={16}
          width="80%"
          baseColor="var(--skeleton-base)"
          highlightColor="var(--skeleton-highlight)"
          className="max-w-md mx-auto"
        />
      </div>
    </ProfileCard>
  );
}
