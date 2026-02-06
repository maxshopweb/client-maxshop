"use client";

import { useState, useEffect } from "react";
import { extractArticleCodeAndExtension, generateImageVariations } from "@/app/utils/productImage";
import { buildImageUrl } from "@/app/lib/upload";

/** Convierte path relativo a URL absoluta (evita 404 en localhost) */
function toAbsoluteUrl(path: string | null | undefined): string {
  if (!path || typeof path !== "string") return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return buildImageUrl(path.startsWith("/") ? path : `/${path}`);
}

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
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      setError(false);

      // Si img_principal existe, intentar usarla (siempre como URL absoluta)
      if (imgPrincipal && (imgPrincipal.includes("/imgs/productos/") || imgPrincipal.includes("productos/"))) {
        const absoluteUrl = toAbsoluteUrl(imgPrincipal.startsWith("/") ? imgPrincipal : `imgs/productos/${imgPrincipal}`);
        if (absoluteUrl) {
          try {
            const img = new Image();
            await new Promise((resolve, reject) => {
              const timeout = setTimeout(() => reject(new Error("Timeout")), 5000);
              img.onload = () => {
                clearTimeout(timeout);
                resolve(true);
              };
              img.onerror = () => {
                clearTimeout(timeout);
                reject(new Error("Image load failed"));
              };
              img.src = absoluteUrl;
            });
            setImageSrc(absoluteUrl);
            return;
          } catch {
            // Continuar con variaciones
          }
        }
      }

      // También intentar directamente el path con base URL (ej: "8202-03.png")
      if (imgPrincipal && imgPrincipal.trim()) {
        const absoluteUrl = toAbsoluteUrl(imgPrincipal.startsWith("/") ? imgPrincipal : `imgs/productos/${imgPrincipal}`);
        if (absoluteUrl) {
          try {
            const img = new Image();
            await new Promise((resolve, reject) => {
              const timeout = setTimeout(() => reject(new Error("Timeout")), 5000);
              img.onload = () => {
                clearTimeout(timeout);
                resolve(true);
              };
              img.onerror = () => reject(new Error("Image load failed"));
              img.src = absoluteUrl;
            });
            setImageSrc(absoluteUrl);
            return;
          } catch {
            // Continuar
          }
        }
      }

      // Extraer código y extensión del artículo
      const codeAndExt = extractArticleCodeAndExtension(imgPrincipal, codiArti);
      if (!codeAndExt) {
        setError(true);
        return;
      }

      const variations = generateImageVariations(codeAndExt.code, codeAndExt.extension);
      for (const relPath of variations) {
        const absoluteUrl = toAbsoluteUrl(relPath);
        if (!absoluteUrl) continue;
        try {
          const img = new Image();
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error("Timeout")), 5000);
            img.onload = () => {
              clearTimeout(timeout);
              resolve(true);
            };
            img.onerror = () => reject(new Error("Image load failed"));
            img.src = absoluteUrl;
          });
          setImageSrc(absoluteUrl);
          return;
        } catch {
          continue;
        }
      }

      setError(true);
    };

    loadImage();
  }, [imgPrincipal, codiArti]);

  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

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
      onError={() => setError(true)}
    />
  );
}

