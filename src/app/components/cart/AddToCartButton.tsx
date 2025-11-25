"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/app/stores/cartStore";
import { IProductos } from "@/app/types/producto.type";
import { Button } from "../ui/Button";
import { useCartSidebar } from "@/app/hooks/useCartSidebar";

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
  const { open } = useCartSidebar();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
      disabled={added}
    >
      {showIcon && (
        <>
          {added ? (
            <Check className="w-4 h-4" />
          ) : (
            <ShoppingCart className="w-4 h-4" />
          )}
        </>
      )}
      <span>{added ? "Agregado" : "Agregar al carrito"}</span>
    </Button>
  );
}

