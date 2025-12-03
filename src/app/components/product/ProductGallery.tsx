"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { IProductos } from "@/app/types/producto.type";
import { extractArticleCodeAndExtension, generateImageVariations } from "@/app/utils/productImage";

interface ProductGalleryProps {
  producto: IProductos;
}

export default function ProductGallery({ producto }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      const loadedImages: string[] = [];

      // Agregar imagen principal si existe
      if (producto.img_principal && producto.img_principal.startsWith('/imgs/productos/')) {
        loadedImages.push(producto.img_principal);
      }

      // Agregar imágenes adicionales del array imagenes
      if (producto.imagenes && Array.isArray(producto.imagenes)) {
        producto.imagenes.forEach((img) => {
          if (typeof img === 'string' && img.startsWith('/imgs/productos/')) {
            if (!loadedImages.includes(img)) {
              loadedImages.push(img);
            }
          }
        });
      }

      // Si no hay imágenes, intentar generar desde codi_arti
      if (loadedImages.length === 0 && producto.codi_arti) {
        const codeAndExt = extractArticleCodeAndExtension(
          producto.img_principal,
          producto.codi_arti
        );
        
        if (codeAndExt) {
          const variations = generateImageVariations(codeAndExt.code, codeAndExt.extension);
          // Intentar cargar la primera variación
          loadedImages.push(variations[0]);
        }
      }

      setImages(loadedImages);
      if (loadedImages.length > 0) {
        setSelectedImage(loadedImages[0]);
      }
      setLoading(false);
    };

    loadImages();
  }, [producto]);

  const handleThumbnailClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleNext = () => {
    if (!selectedImage) return;
    const currentIndex = images.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };

  const handlePrevious = () => {
    if (!selectedImage) return;
    const currentIndex = images.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
  };

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <div className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-20 h-20 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-6xl opacity-20">🛠️</span>
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-4">
        {/* Imagen principal */}
        <motion.div
          className="relative aspect-square w-full bg-white rounded-lg overflow-hidden border border-card-border cursor-pointer group"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          onClick={() => setLightboxOpen(true)}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt={producto.nombre || "Producto"}
              className="w-full h-full object-contain"
            />
          )}
          
          {/* Overlay con zoom icon en hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <ZoomIn className="w-12 h-12 text-white drop-shadow-lg" />
          </div>

          {/* Botones de navegación (solo si hay más de una imagen) */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-5 h-5 text-secundario" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="w-5 h-5 text-secundario" />
              </button>
            </>
          )}
        </motion.div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => handleThumbnailClick(image)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === image
                    ? "border-principal scale-105"
                    : "border-transparent hover:border-principal/50"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${producto.nombre} - Vista ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-principal transition-colors z-10"
              aria-label="Cerrar"
            >
              <X className="w-8 h-8" />
            </motion.button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-principal transition-colors z-10"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-10 h-10" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-principal transition-colors z-10"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-10 h-10" />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full h-full max-w-7xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt={producto.nombre || "Producto"}
                className="w-full h-full object-contain"
              />
            </motion.div>

            {/* Indicador de imagen */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                {images.indexOf(selectedImage) + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

