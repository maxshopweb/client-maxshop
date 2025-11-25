"use client";

import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";

interface SectionTitleProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionTitle({ 
  title, 
  children, 
  className = "" 
}: SectionTitleProps) {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation({
    threshold: 0.2,
    triggerOnce: true,
  });

  const { elementRef: lineRef, isVisible: lineVisible } = useScrollAnimation({
    threshold: 0.2,
    triggerOnce: true,
    delay: 200,
  });

  return (
    <section className={`pb-8 md:py-5 lg:py-8 bg-background ${className}`}>
      <div className="container mx-auto px-4">
        {/* Título Minimalista */}
        <div className="mb-4 md:mb-4">
          <h2 
            ref={titleRef}
            className={`text-xl sm:text-2xl md:text-3xl text-foreground tracking-tight transition-all duration-700 ease-out ${
              titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {title}
          </h2>
          {/* Decorativo Minimalista - Línea sutil */}
          <div 
            ref={lineRef}
            className={`mt-3 h-px bg-principal/30 transition-all duration-700 ease-out ${
              lineVisible ? "opacity-100 w-16" : "opacity-0 w-0"
            }`}
          ></div>
        </div>

        {/* Children */}
        {children}
      </div>
    </section>
  );
}

