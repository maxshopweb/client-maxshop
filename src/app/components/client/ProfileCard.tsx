import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface ProfileCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

export default function ProfileCard({ 
  title, 
  icon: Icon, 
  children, 
  className = "" 
}: ProfileCardProps) {
  return (
    <div className={`bg-card rounded-xl shadow-sm border border-input p-4 sm:p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 border-b border-input">
        {Icon && (
          <div className="p-2 bg-principal/10 rounded-lg">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-principal" />
          </div>
        )}
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          {title}
        </h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

