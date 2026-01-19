import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ICartItem, ICartSummary, IDatosEnvio, IDatosFacturacion, IDatosPago, ICheckoutState } from '../types/cart.type';
import { IProductos } from '../types/producto.type';

interface CartState {
  // Items del carrito
  items: ICartItem[];
  
  // Estado del checkout
  checkoutState: ICheckoutState;
  
  // Resumen calculado
  summary: ICartSummary;
  
  // Acciones
  addItem: (producto: IProductos, cantidad?: number) => void;
  removeItem: (id_prod: number) => void;
  updateQuantity: (id_prod: number, cantidad: number) => void;
  clearCart: () => void;
  
  // Checkout
  setDatosEnvio: (datos: IDatosEnvio) => void;
  setDatosFacturacion: (datos: IDatosFacturacion) => void;
  setDatosPago: (datos: IDatosPago) => void;
  setStep: (step: 1 | 2 | 3) => void;
  resetCheckout: () => void;
  
  // Cálculo de resumen
  calculateSummary: () => ICartSummary;
}

// Función para calcular precio con descuentos
const calcularPrecioFinal = (producto: IProductos): number => {
  const precioMinorista = Number(producto.precio_minorista || 0);
  const precio = Number(producto.precio || 0);
  
  // Si hay precio menor que minorista, hay descuento
  if (precio && precioMinorista && precio < precioMinorista) {
    return precio;
  }
  
  return precio || precioMinorista || 0;
};

// Función para calcular descuento
const calcularDescuento = (producto: IProductos): number => {
  const precioMinorista = Number(producto.precio_minorista || 0);
  const precio = Number(producto.precio || 0);
  
  if (precio && precioMinorista && precio < precioMinorista) {
    return precioMinorista - precio;
  }
  
  return 0;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      checkoutState: {
        step: 1,
        items: [],
        datosEnvio: null,
        datosFacturacion: null,
        datosPago: null,
      },
      summary: {
        subtotal: 0,
        descuentos: 0,
        envio: 0,
        total: 0,
        cantidadItems: 0,
      },
      
      // Agregar item al carrito
      addItem: (producto, cantidad = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id_prod === producto.id_prod);
          
          if (existingItem) {
            // Si ya existe, actualizar cantidad
            const newQuantity = existingItem.cantidad + cantidad;
            const precioUnitario = calcularPrecioFinal(producto);
            const descuento = calcularDescuento(producto);
            
            const updatedItems = state.items.map((item) =>
              item.id_prod === producto.id_prod
                ? {
                    ...item,
                    cantidad: newQuantity,
                    precio_unitario: precioUnitario,
                    descuento: descuento * newQuantity,
                    subtotal: precioUnitario * newQuantity,
                  }
                : item
            );
            
            // Calcular summary con los items actualizados
            const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
            const descuentos = updatedItems.reduce((sum, item) => sum + (item.descuento || 0), 0);
            // El costo de envío ahora se calcula dinámicamente en el checkout, no aquí
            const envio = 0; // Removido: se calcula dinámicamente en checkout
            const total = subtotal - descuentos + envio;
            const cantidadItems = updatedItems.reduce((sum, item) => sum + item.cantidad, 0);
            
            const newSummary = {
              subtotal,
              descuentos,
              envio,
              total,
              cantidadItems,
            };
            
            return {
              items: updatedItems,
              summary: newSummary,
            };
          } else {
            // Si no existe, agregar nuevo item
            const precioUnitario = calcularPrecioFinal(producto);
            const descuento = calcularDescuento(producto);
            const newItem: ICartItem = {
              id_prod: producto.id_prod,
              producto,
              cantidad,
              precio_unitario: precioUnitario,
              descuento: descuento * cantidad,
              subtotal: precioUnitario * cantidad,
            };
            
            const updatedItems = [...state.items, newItem];
            
            // Calcular summary con los items actualizados
            const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
            const descuentos = updatedItems.reduce((sum, item) => sum + (item.descuento || 0), 0);
            // El costo de envío ahora se calcula dinámicamente en el checkout, no aquí
            const envio = 0; // Removido: se calcula dinámicamente en checkout
            const total = subtotal - descuentos + envio;
            const cantidadItems = updatedItems.reduce((sum, item) => sum + item.cantidad, 0);
            
            const newSummary = {
              subtotal,
              descuentos,
              envio,
              total,
              cantidadItems,
            };
            
            return {
              items: updatedItems,
              summary: newSummary,
            };
          }
        });
      },
      
      // Eliminar item del carrito
      removeItem: (id_prod) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id_prod !== id_prod);
          
          // Calcular summary con los items actualizados
          const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
          const descuentos = updatedItems.reduce((sum, item) => sum + (item.descuento || 0), 0);
          const envio = subtotal > 50000 ? 0 : 2000;
          const total = subtotal - descuentos + envio;
          const cantidadItems = updatedItems.reduce((sum, item) => sum + item.cantidad, 0);
          
          const newSummary = {
            subtotal,
            descuentos,
            envio,
            total,
            cantidadItems,
          };
          
          return {
            items: updatedItems,
            summary: newSummary,
          };
        });
      },
      
      // Actualizar cantidad de un item
      updateQuantity: (id_prod, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(id_prod);
          return;
        }
        
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id_prod === id_prod) {
              // Recalcular precio unitario y descuento basándose en el producto actual
              const precioUnitario = calcularPrecioFinal(item.producto);
              const descuento = calcularDescuento(item.producto);
              return {
                ...item,
                cantidad,
                precio_unitario: precioUnitario,
                descuento: descuento * cantidad,
                subtotal: precioUnitario * cantidad,
              };
            }
            return item;
          });
          
          // Calcular summary con los items actualizados
          const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
          const descuentos = updatedItems.reduce((sum, item) => sum + (item.descuento || 0), 0);
          const envio = subtotal > 50000 ? 0 : 2000;
          const total = subtotal - descuentos + envio;
          const cantidadItems = updatedItems.reduce((sum, item) => sum + item.cantidad, 0);
          
          const newSummary = {
            subtotal,
            descuentos,
            envio,
            total,
            cantidadItems,
          };
          
          return {
            items: updatedItems,
            summary: newSummary,
          };
        });
      },
      
      // Limpiar carrito
      clearCart: () => {
        set({
          items: [],
          summary: {
            subtotal: 0,
            descuentos: 0,
            envio: 0,
            total: 0,
            cantidadItems: 0,
          },
        });
      },
      
      // Setear datos de envío
      setDatosEnvio: (datos) => {
        set((state) => ({
          checkoutState: {
            ...state.checkoutState,
            datosEnvio: datos,
          },
        }));
      },
      
      // Setear datos de facturación
      setDatosFacturacion: (datos) => {
        set((state) => ({
          checkoutState: {
            ...state.checkoutState,
            datosFacturacion: datos,
          },
        }));
      },
      
      // Setear datos de pago
      setDatosPago: (datos) => {
        set((state) => ({
          checkoutState: {
            ...state.checkoutState,
            datosPago: datos,
          },
        }));
      },
      
      // Cambiar step
      setStep: (step) => {
        set((state) => ({
          checkoutState: {
            ...state.checkoutState,
            step,
          },
        }));
      },
      
      // Resetear checkout
      resetCheckout: () => {
        set((state) => ({
          checkoutState: {
            step: 1,
            items: state.items,
            datosEnvio: null,
            datosFacturacion: null,
            datosPago: null,
          },
        }));
      },
      
      // Calcular resumen
      calculateSummary: () => {
        const state = get();
        const subtotal = state.items.reduce((sum, item) => sum + item.subtotal, 0);
        const descuentos = state.items.reduce((sum, item) => sum + (item.descuento || 0), 0);
        
        // El costo de envío ahora se calcula dinámicamente en el checkout mediante cotización de Andreani
        const envio = 0; // Removido: se calcula dinámicamente en checkout
        
        const total = subtotal - descuentos + envio;
        const cantidadItems = state.items.reduce((sum, item) => sum + item.cantidad, 0);
        
        return {
          subtotal,
          descuentos,
          envio,
          total,
          cantidadItems,
        };
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        // No persistir el estado del checkout, solo los items
      }),
      onRehydrateStorage: () => (state) => {
        // Recalcular summary cuando se carga desde localStorage
        if (state && state.items.length > 0) {
          // Recalcular precios y subtotales de cada item
          const updatedItems = state.items.map((item) => {
            const precioUnitario = calcularPrecioFinal(item.producto);
            const descuento = calcularDescuento(item.producto);
            return {
              ...item,
              precio_unitario: precioUnitario,
              descuento: descuento * item.cantidad,
              subtotal: precioUnitario * item.cantidad,
            };
          });
          
          // Calcular summary con los items actualizados
          const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
          const descuentos = updatedItems.reduce((sum, item) => sum + (item.descuento || 0), 0);
          const envio = subtotal > 50000 ? 0 : 2000;
          const total = subtotal - descuentos + envio;
          const cantidadItems = updatedItems.reduce((sum, item) => sum + item.cantidad, 0);
          
          // Actualizar estado
          state.items = updatedItems;
          state.summary = {
            subtotal,
            descuentos,
            envio,
            total,
            cantidadItems,
          };
        }
      },
    }
  )
);

