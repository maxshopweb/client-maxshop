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
      className={`transition-all duration-500 ${
        shouldShowBackground
          ? "py-2 shadow-lg bg-principal text-white"
          : "py-4 bg-principal text-white"
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

