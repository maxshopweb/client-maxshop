"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/app/stores/cartStore";
import { IProductos } from "@/app/types/producto.type";
import { Button } from "../ui/Button";
import { useCartSidebar } from "@/app/hooks/useCartSidebar";
import { toast } from "sonner";
import { validateAgregarAlCarrito } from "@/app/utils/stock";

interface AddToCartButtonProps {
  producto: IProductos;
  cantidad?: number;
  variant?: "primary" | "outline-primary" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export default function AddToCartButton({
  producto,
  cantidad = 1,
  variant = "primary",
  size = "md",
  showIcon = true,
  className = "",
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();
  const cantidadEnCarrito = useCartStore((s) => s.items.find((i) => i.id_prod === producto.id_prod)?.cantidad ?? 0);
  const { open } = useCartSidebar();

  const isInactive = producto.activo !== "S" && producto.estado !== 1;
  const stockErr = validateAgregarAlCarrito(producto, cantidadEnCarrito, cantidad);
  const cannotAdd = isInactive || !!stockErr;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (cannotAdd) {
      toast.error("No disponible");
      return;
    }

    addItem(producto, cantidad);
    setAdded(true);
    
    // Abrir el carrito después de agregar
    setTimeout(() => {
      open();
    }, 300);
    
    // Resetear el estado después de 2 segundos
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      className={className}
      disabled={added || cannotAdd}
    >
      {showIcon && (
        <>
          {added ? (
            <Check className="w-4 h-4" />
          ) : cannotAdd ? null : (
            <ShoppingCart className="w-4 h-4" />
          )}
        </>
      )}
      <span>
        {added ? "Agregado" : cannotAdd ? (
          "No disponible"
        ) : (
          <>
            <span className="sm:hidden">Agregar</span>
            <span className="hidden sm:inline">Agregar al carrito</span>
          </>
        )}
      </span>
    </Button>
  );
}

