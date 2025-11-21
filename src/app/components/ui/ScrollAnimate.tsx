"use client";

import { ReactNode } from "react";
import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";

interface ScrollAnimateProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "fade";
}

export default function ScrollAnimate({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: ScrollAnimateProps) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
    delay,
  });

  const directionClasses = {
    up: isVisible
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-8",
    down: isVisible
      ? "opacity-100 translate-y-0"
      : "opacity-0 -translate-y-8",
    left: isVisible
      ? "opacity-100 translate-x-0"
      : "opacity-0 -translate-x-8",
    right: isVisible
      ? "opacity-100 translate-x-0"
      : "opacity-0 translate-x-8",
    fade: isVisible ? "opacity-100" : "opacity-0",
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-700 ease-out ${directionClasses[direction]} ${className}`}
    >
      {children}
    </div>
  );
}

