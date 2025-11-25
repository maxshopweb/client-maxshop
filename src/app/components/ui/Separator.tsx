"use client";

export function Separator({ className = "" }: { className?: string }) {
  return (
    <div className={`h-px bg-input ${className}`} />
  );
}

