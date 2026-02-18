"use client";

import { useEffect, useMemo, useState } from "react";
import { extractArticleCodeAndExtension, generateImageVariations } from "@/app/utils/productImage";
import { resolveProductImageUrl } from "@/app/lib/upload";

interface ProductImageProps {
  imgPrincipal: string | null | undefined;
  codiArti?: string | null;
  nombre?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ProductImage({
  imgPrincipal,
  codiArti,
  nombre,
  className = "",
  size = "md",
}: ProductImageProps) {
  const [index, setIndex] = useState(0);
  const [error, setError] = useState(false);

  const candidates = useMemo(() => {
    const urls: string[] = [];

    const primary = resolveProductImageUrl(imgPrincipal);
    if (primary) urls.push(primary);

    // Fallback legacy para artículos de Excel que no tienen path completo.
    const codeAndExt = extractArticleCodeAndExtension(imgPrincipal, codiArti);
    if (codeAndExt) {
      const variations = generateImageVariations(codeAndExt.code, codeAndExt.extension);
      for (const variation of variations) {
        const resolved = resolveProductImageUrl(variation);
        if (resolved && !urls.includes(resolved)) {
          urls.push(resolved);
        }
      }
    }

    return urls;
  }, [imgPrincipal, codiArti]);

  useEffect(() => {
    setIndex(0);
    setError(false);
  }, [candidates]);

  useEffect(() => {
    if (candidates.length === 0) {
      setError(true);
    }
  }, [candidates]);

  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

  const imageSrc = candidates[index] ?? "";

  if (error || !imageSrc) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${sizeClasses[size]} opacity-20 ${className}`}>
        🛠️
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={nombre || "Producto"}
      className={`w-full h-full object-contain transition-transform duration-300 ${className}`}
      onError={() => {
        if (index < candidates.length - 1) {
          setIndex((prev) => prev + 1);
          return;
        }
        setError(true);
      }}
    />
  );
}

