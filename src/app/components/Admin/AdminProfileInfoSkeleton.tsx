import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProfileCard from "../client/ProfileCard";
import { User, Shield } from "lucide-react";

export default function AdminProfileInfoSkeleton() {
  return (
    <div className="space-y-6">
      {/* Información personal */}
      <ProfileCard title="Información personal" icon={User}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
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
          ))}
        </div>
      </ProfileCard>

      {/* Información de cuenta */}
      <ProfileCard title="Información de cuenta" icon={Shield}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={i === 2 ? "sm:col-span-2" : ""}>
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
                  width={i === 2 ? "90%" : "70%"}
                  baseColor="#d1d5db"
                  highlightColor="#e5e7eb"
                />
              </div>
            </div>
          ))}
        </div>
      </ProfileCard>
    </div>
  );
}

