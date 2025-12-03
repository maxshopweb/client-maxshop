"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check, Minus, Plus, AlertCircle } from "lucide-react";
import { IProductos } from "@/app/types/producto.type";
import { useCartStore } from "@/app/stores/cartStore";
import { useCartSidebar } from "@/app/hooks/useCartSidebar";
import { Button } from "../ui/Button";
import { toast } from "sonner";

interface AddToCartSectionProps {
  producto: IProductos;
}

export default function AddToCartSection({ producto }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();
  const { open } = useCartSidebar();

  const stock = producto.stock ?? 0;
  const maxQuantity = stock;
  const isOutOfStock = stock === 0;
  const isInactive = producto.activo !== "S" && producto.estado !== 1;

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`Solo hay ${maxQuantity} unidades disponibles`);
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      toast.error("Este producto no tiene stock disponible");
      return;
    }

    if (isInactive) {
      toast.error("Este producto no está disponible");
      return;
    }

    if (quantity > maxQuantity) {
      toast.error(`Solo puedes agregar hasta ${maxQuantity} unidades`);
      return;
    }

    setIsAdding(true);
    
    try {
      // Simular delay para mejor UX
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      addItem(producto, quantity);
      setAdded(true);
      
      toast.success(`${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} agregada${quantity > 1 ? 's' : ''} al carrito`, {
        duration: 2000,
      });

      // Abrir el carrito después de agregar
      setTimeout(() => {
        open();
      }, 500);

      // Resetear estado después de 2 segundos
      setTimeout(() => {
        setAdded(false);
        setQuantity(1);
      }, 2000);
    } catch (error) {
      toast.error("Error al agregar al carrito. Intenta nuevamente.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock || isInactive) {
      toast.error("Este producto no está disponible para compra");
      return;
    }

    handleAddToCart();
    // Redirigir al checkout después de agregar
    setTimeout(() => {
      window.location.href = "/checkout";
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4 p-6 bg-card rounded-lg border border-card-border"
    >
      {/* Selector de cantidad */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Cantidad</label>
        <div className="flex items-center gap-3">
          <motion.button
            onClick={handleDecrease}
            disabled={quantity <= 1 || isOutOfStock}
            className="w-10 h-10 rounded-full border-2 border-card-border flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-principal/10 hover:border-principal transition-colors"
            whileHover={{ scale: quantity > 1 ? 1.1 : 1 }}
            whileTap={{ scale: quantity > 1 ? 0.9 : 1 }}
          >
            <Minus className="w-5 h-5 text-foreground" />
          </motion.button>

          <motion.input
            type="number"
            min="1"
            max={maxQuantity}
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              if (value >= 1 && value <= maxQuantity) {
                setQuantity(value);
              } else if (value > maxQuantity) {
                setQuantity(maxQuantity);
                toast.error(`Solo hay ${maxQuantity} unidades disponibles`);
              }
            }}
            className="w-20 text-center text-lg font-semibold border-2 border-card-border rounded-lg py-2 focus:outline-none focus:border-principal bg-input text-input-text"
            disabled={isOutOfStock}
          />

          <motion.button
            onClick={handleIncrease}
            disabled={quantity >= maxQuantity || isOutOfStock}
            className="w-10 h-10 rounded-full border-2 border-card-border flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-principal/10 hover:border-principal transition-colors"
            whileHover={{ scale: quantity < maxQuantity ? 1.1 : 1 }}
            whileTap={{ scale: quantity < maxQuantity ? 0.9 : 1 }}
          >
            <Plus className="w-5 h-5 text-foreground" />
          </motion.button>
        </div>
        <p className="text-xs text-foreground/60">
          Máximo: {maxQuantity} unidades
        </p>
      </div>

      {/* Mensaje de error si no hay stock */}
      {isOutOfStock && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm"
        >
          <AlertCircle className="w-5 h-5" />
          <span>Este producto no tiene stock disponible</span>
        </motion.div>
      )}

      {/* Mensaje si está inactivo */}
      {isInactive && !isOutOfStock && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm"
        >
          <AlertCircle className="w-5 h-5" />
          <span>Este producto no está disponible actualmente</span>
        </motion.div>
      )}

      {/* Botones de acción */}
      <div className="space-y-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isInactive || isAdding || added}
            variant="primary"
            size="lg"
            fullWidth
            className="relative overflow-hidden"
          >
            {isAdding ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Agregando...
              </span>
            ) : added ? (
              <span className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                Agregado
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Agregar al Carrito
              </span>
            )}
          </Button>
        </motion.div>

        <Button
          onClick={handleBuyNow}
          disabled={isOutOfStock || isInactive || isAdding}
          variant="outline-primary"
          size="lg"
          fullWidth
        >
          Comprar Ahora
        </Button>
      </div>

      {/* Información adicional */}
      <div className="pt-4 border-t border-dotted border-card-border space-y-2 text-sm text-foreground/70">
        <p>✓ Envío gratis en compras superiores a $50.000</p>
        <p>✓ Devolución garantizada en 30 días</p>
        <p>✓ Soporte técnico incluido</p>
      </div>
    </motion.div>
  );
}

