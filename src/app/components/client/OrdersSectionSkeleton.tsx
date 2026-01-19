import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProfileCard from "./ProfileCard";
import { Package } from "lucide-react";

export default function OrdersSectionSkeleton() {
  return (
    <ProfileCard title="Mis pedidos" icon={Package}>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="border border-input rounded-lg p-4 sm:p-6">
            {/* Header del pedido */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex-1">
                <Skeleton
                  height={24}
                  width={120}
                  baseColor="var(--skeleton-base)"
                  highlightColor="var(--skeleton-highlight)"
                  className="mb-2"
                />
                <Skeleton
                  height={16}
                  width={80}
                  baseColor="var(--skeleton-base)"
                  highlightColor="var(--skeleton-highlight)"
                />
              </div>
              <Skeleton
                height={28}
                width={100}
                baseColor="var(--skeleton-base)"
                highlightColor="var(--skeleton-highlight)"
              />
            </div>
            {/* Estados */}
            <div className="flex flex-wrap gap-3 mb-4">
              <Skeleton
                height={24}
                width={80}
                borderRadius={999}
                baseColor="var(--skeleton-base)"
                highlightColor="var(--skeleton-highlight)"
              />
              <Skeleton
                height={24}
                width={80}
                borderRadius={999}
                baseColor="var(--skeleton-base)"
                highlightColor="var(--skeleton-highlight)"
              />
            </div>
            {/* Productos */}
            <div className="border-t border-input pt-4">
              <Skeleton
                height={16}
                width={120}
                baseColor="var(--skeleton-base)"
                highlightColor="var(--skeleton-highlight)"
                className="mb-3"
              />
              <div className="space-y-2">
                <Skeleton
                  height={16}
                  width="100%"
                  baseColor="var(--skeleton-base)"
                  highlightColor="var(--skeleton-highlight)"
                />
                <Skeleton
                  height={16}
                  width="75%"
                  baseColor="var(--skeleton-base)"
                  highlightColor="var(--skeleton-highlight)"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </ProfileCard>
  );
}
