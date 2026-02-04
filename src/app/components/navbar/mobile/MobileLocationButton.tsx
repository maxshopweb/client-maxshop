"use client";

import { MapPin } from "lucide-react";

interface MobileLocationButtonProps {
  localidad: string;
  onClick: () => void;
}

export default function MobileLocationButton({
  localidad,
  onClick,
}: MobileLocationButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 border-b border-white/20 text-left hover:bg-white/5 transition-colors"
    >
      <div className="flex items-center gap-2 text-sm text-white">
        <MapPin size={16} />
        <span>Estás en: {localidad}</span>
      </div>
    </button>
  );
}

