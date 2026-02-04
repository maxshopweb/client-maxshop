"use client";

import { MapPin } from "lucide-react";

interface NavbarLocationIndicatorProps {
  localidad: string;
  shouldShowBackground: boolean;
  actualTheme: "light" | "dark";
  onLocationClick: () => void;
}

export default function NavbarLocationIndicator({
  localidad,
  shouldShowBackground,
  actualTheme,
  onLocationClick,
}: NavbarLocationIndicatorProps) {
  const iconClassName = shouldShowBackground
    ? actualTheme === 'dark'
      ? "text-white"
      : "text-terciario"
    : "text-white";

  const textClassName = shouldShowBackground
    ? actualTheme === 'dark'
      ? "text-white"
      : "text-terciario"
    : "text-white";

  return (
    <button
      onClick={onLocationClick}
      className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity cursor-pointer"
    >
      <MapPin size={16} className={iconClassName} />
      <span className={textClassName}>
        Estás en: {localidad}
      </span>
    </button>
  );
}

