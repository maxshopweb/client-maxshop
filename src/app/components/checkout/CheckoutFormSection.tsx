"use client";

import { ReactNode } from "react";

interface CheckoutFormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function CheckoutFormSection({
  title,
  description,
  children,
  className = "",
}: CheckoutFormSectionProps) {
  return (
    <section className={`space-y-5 ${className}`.trim()}>
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-semibold text-foreground/90 tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-foreground/55">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
