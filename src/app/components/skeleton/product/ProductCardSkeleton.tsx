import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-xl overflow-hidden flex flex-col h-full shadow-sm">
      {/* Imagen del Producto */}
      <div className="relative aspect-square bg-gradient-to-br from-background to-background/50 overflow-hidden">
        <Skeleton 
          height="100%" 
          baseColor="var(--skeleton-base)" 
          highlightColor="var(--skeleton-highlight)"
          className="w-full h-full"
        />
      </div>

      {/* Información del Producto */}
      <div className="p-5 flex flex-col flex-1">
        {/* Nombre del Producto */}
        <div className="mb-2">
          <Skeleton 
            height={24} 
            baseColor="var(--skeleton-base)" 
            highlightColor="var(--skeleton-highlight)"
            className="mb-2"
          />
          <Skeleton 
            height={20} 
            width="60%" 
            baseColor="var(--skeleton-base)" 
            highlightColor="var(--skeleton-highlight)"
          />
        </div>

        {/* Marca */}
        <div className="mb-4">
          <Skeleton 
            height={14} 
            width="40%" 
            baseColor="var(--skeleton-base)" 
            highlightColor="var(--skeleton-highlight)"
          />
        </div>

        {/* Precio y Botón */}
        <div className="mt-auto space-y-3">
          <div>
            <Skeleton 
              height={32} 
              width="50%" 
              baseColor="var(--skeleton-base)" 
              highlightColor="var(--skeleton-highlight)"
            />
          </div>
          
          {/* Botón Agregar al Carrito */}
          <Skeleton 
            height={40} 
            baseColor="var(--skeleton-base)" 
            highlightColor="var(--skeleton-highlight)"
            className="w-full rounded-md"
          />
        </div>
      </div>
    </div>
  );
}

