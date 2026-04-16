"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check, Minus, Plus, Truck, CreditCard, Headphones } from "lucide-react";
import { IProductos } from "@/app/types/producto.type";
import { useCartStore } from "@/app/stores/cartStore";
import { useCartSidebar } from "@/app/hooks/useCartSidebar";
import { Button } from "../ui/Button";
import { toast } from "sonner";
import { useConfigTienda } from "@/app/hooks/config/useConfigTienda";
import { getEnvioGratisMensaje, getCuotasSinInteresMensaje } from "@/app/utils/promos-messages";
import { validateAgregarAlCarrito } from "@/app/utils/stock";

interface AddToCartSectionProps {
  producto: IProductos;
}

export default function AddToCartSection({ producto }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();
  const cantidadEnCarrito = useCartStore((s) => s.items.find((i) => i.id_prod === producto.id_prod)?.cantidad ?? 0);
  const { open } = useCartSidebar();
  const { data: config } = useConfigTienda();

  const stock = producto.stock ?? 0;
  /** Unidades que aún se pueden sumar al carrito (stock menos lo ya agregado). */
  const maxQuantity = Math.max(0, stock - cantidadEnCarrito);
  const isOutOfStock = stock === 0;
  const isInactive = producto.activo !== "S" && producto.estado !== 1;
  /** No se puede sumar más al carrito (sin stock, inactivo o ya cubierto el stock en carrito). */
  const cannotPurchase =
    isOutOfStock || isInactive || maxQuantity === 0;

  useEffect(() => {
    if (maxQuantity > 0 && quantity > maxQuantity) {
      setQuantity(maxQuantity);
    }
  }, [maxQuantity, producto.id_prod]);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (maxQuantity <= 0) {
      toast.error("No disponible");
      return;
    }
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    } else {
      toast.error("No disponible");
    }
  };

  const handleAddToCart = async () => {
    if (cannotPurchase) {
      toast.error("No disponible");
      return;
    }

    const stockErr = validateAgregarAlCarrito(producto, cantidadEnCarrito, quantity);
    if (stockErr) {
      toast.error("No disponible");
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
    if (cannotPurchase) {
      toast.error("No disponible");
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
      className="space-y-3 sm:space-y-4"
    >
      {/* Selector de cantidad */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-medium text-terciario">Cantidad</label>
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            onClick={handleDecrease}
            disabled={cannotPurchase || quantity <= 1}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-card-border/50 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-principal/10 hover:border-principal transition-colors"
            whileHover={{ scale: quantity > 1 ? 1.05 : 1 }}
            whileTap={{ scale: quantity > 1 ? 0.95 : 1 }}
          >
            <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-terciario" />
          </motion.button>

          <motion.input
            type="number"
            min="1"
            max={maxQuantity > 0 ? maxQuantity : 1}
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              if (maxQuantity <= 0) return;
              if (value >= 1 && value <= maxQuantity) {
                setQuantity(value);
              } else if (value > maxQuantity) {
                setQuantity(maxQuantity);
                toast.error("No disponible");
              }
            }}
            className="w-16 sm:w-20 text-center text-base sm:text-lg font-semibold border border-card-border/50 rounded-lg py-1.5 sm:py-2 focus:outline-none focus:border-principal bg-input text-input-text [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            disabled={cannotPurchase}
          />

          <motion.button
            onClick={handleIncrease}
            disabled={cannotPurchase || quantity >= maxQuantity}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-card-border/50 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-principal/10 hover:border-principal transition-colors"
            whileHover={{ scale: quantity < maxQuantity ? 1.05 : 1 }}
            whileTap={{ scale: quantity < maxQuantity ? 0.95 : 1 }}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-terciario" />
          </motion.button>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex-1"
        >
          <Button
            onClick={handleAddToCart}
            disabled={cannotPurchase || isAdding || added}
            variant="primary"
            size="lg"
            fullWidth
            className="relative overflow-hidden text-xs sm:text-sm"
          >
            {isAdding ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Agregando...
              </span>
            ) : added ? (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Agregado
              </span>
            ) : cannotPurchase ? (
              <span>No disponible</span>
            ) : (
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Agregar al carrito
              </span>
            )}
          </Button>
        </motion.div>

        <div className="flex-1">
          <Button
            onClick={handleBuyNow}
            disabled={cannotPurchase || isAdding}
            variant="outline-primary"
            size="lg"
            fullWidth
            className="text-xs sm:text-sm"
          >
            {cannotPurchase ? "No disponible" : "Comprar Ahora"}
          </Button>
        </div>
      </div>

      {/* Beneficios: debajo de botones, una columna en desktop, texto discreto */}
      <div className="flex flex-col gap-2 sm:gap-2.5 pt-3 sm:pt-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-terciario/5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center">
            <Truck className="w-5 h-5 text-principal" />
          </div>
          <p className="text-xs sm:text-sm text-terciario/50 leading-tight">
            {getEnvioGratisMensaje(config)}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-terciario/5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-principal" />
          </div>
          <p className="text-xs sm:text-sm text-terciario/50 leading-tight">
            {getCuotasSinInteresMensaje(config)}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-terciario/5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center">
            <Headphones className="w-5 h-5 text-principal" />
          </div>
          <p className="text-xs sm:text-sm text-terciario/50 leading-tight">
            Soporte técnico incluido
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

