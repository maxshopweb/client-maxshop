"use client";

import { useState, useEffect } from "react";
import { extractArticleCodeAndExtension, generateImageVariations } from "@/app/utils/productImage";

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

      // Si img_principal existe y es válida, intentar usarla primero
      if (imgPrincipal && imgPrincipal.startsWith('/imgs/productos/')) {
        try {
          const img = new Image();
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Timeout')), 2000);
            img.onload = () => {
              clearTimeout(timeout);
              resolve(true);
            };
            img.onerror = () => {
              clearTimeout(timeout);
              reject(new Error('Image load failed'));
            };
            img.src = imgPrincipal;
          });
          
          setImageSrc(imgPrincipal);
          return;
        } catch (err) {
          // Continuar con variaciones
        }
      }

      // Extraer código y extensión del artículo
      const codeAndExt = extractArticleCodeAndExtension(imgPrincipal, codiArti);
      
      if (!codeAndExt) {
        setError(true);
        return;
      }

      // Generar variaciones limitadas (solo 4 intentos máximo)
      const variations = generateImageVariations(codeAndExt.code, codeAndExt.extension);

      // Intentar cargar cada variación con timeout
      for (const imgUrl of variations) {
        try {
          const img = new Image();
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Timeout')), 2000);
            img.onload = () => {
              clearTimeout(timeout);
              resolve(true);
            };
            img.onerror = () => {
              clearTimeout(timeout);
              reject(new Error('Image load failed'));
            };
            img.src = imgUrl;
          });
          
          setImageSrc(imgUrl);
          return;
        } catch (err) {
          // Continuar con la siguiente variación
          continue;
        }
      }

      // Si ninguna imagen funcionó
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

