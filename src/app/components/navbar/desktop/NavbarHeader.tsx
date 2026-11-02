"use client";

interface NavbarHeaderProps {
  shouldShowBackground: boolean;
  children: React.ReactNode;
}

export default function NavbarHeader({
  shouldShowBackground,
  children,
}: NavbarHeaderProps) {
  return (
    <div
      className={`bg-principal py-4 text-white transition-shadow duration-300 ${
        shouldShowBackground ? "shadow-lg" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-2">
          {children}
        </div>
      </div>
    </div>
  );
}

