"use client";

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function MobileMenuOverlay({
  isOpen,
  onClose,
  children,
}: MobileMenuOverlayProps) {
  return (
    <div
      className={`md:hidden fixed inset-0 z-[100] transition-all duration-300 ease-out ${
        isOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-principal shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

