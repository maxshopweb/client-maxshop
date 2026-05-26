import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PersonalFormData } from '../../schemas/personalForm.schema';
import { ShippingFormData } from '../../schemas/shippingForm.schema';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  precioSinImpuestos: number;
  cantidad: number;
  img_principal: string;
  subtotal: number;
  subtotalSinImpuestos: number;
}

interface CheckoutStore {
  currentStep: 1 | 2 | 3 | 4;
  completedSteps: number[];
  cartItems: CartItem[];
  personalData: PersonalFormData | null;
  shippingData: ShippingFormData | null;
  tipoEntrega: 'envio' | 'retiro' | null; // Nuevo: tipo de entrega
  paymentMethod: string | null;
  costoEnvio: number | null; // Costo de envío calculado
  id_direccion: string | null; // ID de dirección guardada seleccionada
  isCreatingOrder: boolean; // Estado para el loader de transición
  wasGuest: boolean; // Si el usuario era invitado al completar el checkout
  codigoPostal: string | null; // Código postal para cotización
  ciudad: string | null; // Ciudad autocompletada desde OpenCage
  provincia: string | null; // Provincia autocompletada desde OpenCage

  setCurrentStep: (step: 1 | 2 | 3 | 4) => void;
  completeStep: (step: number) => void;
  setPersonalData: (data: PersonalFormData) => void;
  setShippingData: (data: ShippingFormData | null) => void;
  setTipoEntrega: (tipo: 'envio' | 'retiro' | null) => void;
  setPaymentMethod: (method: string) => void;
  setCostoEnvio: (costo: number | null) => void;
  setIdDireccion: (id: string | null) => void;
  setIsCreatingOrder: (isCreating: boolean) => void;
  setWasGuest: (wasGuest: boolean) => void;
  setCodigoPostal: (cp: string | null) => void;
  setCiudad: (ciudad: string | null) => void;
  setProvincia: (provincia: string | null) => void;
  clearShippingLocation: () => void; // Limpiar CP, ciudad, provincia
  loadCartFromLocalStorage: () => void;
  setCartItems: (items: CartItem[]) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      completedSteps: [],
      cartItems: [],
      personalData: null,
      shippingData: null,
      tipoEntrega: null,
      paymentMethod: null,
      costoEnvio: null,
      id_direccion: null,
      isCreatingOrder: false,
      wasGuest: false,
      codigoPostal: null,
      ciudad: null,
      provincia: null,

      setCurrentStep: (step) => set({ currentStep: step }),

      completeStep: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step],
        })),

      setPersonalData: (data) => set({ personalData: data }),

      setShippingData: (data) => set({ shippingData: data }),

      setTipoEntrega: (tipo) => set({ tipoEntrega: tipo }),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      setCostoEnvio: (costo) => set({ costoEnvio: costo }),
      
      setIdDireccion: (id) => set({ id_direccion: id }),
      
      setIsCreatingOrder: (isCreating) => set({ isCreatingOrder: isCreating }),
      
      setWasGuest: (wasGuest) => set({ wasGuest }),
      
      setCodigoPostal: (cp) => set({ codigoPostal: cp }),
      
      setCiudad: (ciudad) => set({ ciudad }),
      
      setProvincia: (provincia) => set({ provincia }),
      
      clearShippingLocation: () => set({ 
        codigoPostal: null, 
        ciudad: null, 
        provincia: null,
        costoEnvio: null 
      }),

      loadCartFromLocalStorage: () => {
        if (typeof window === 'undefined') return;
        
        try {
          const cartData = localStorage.getItem('cart-storage');
          if (cartData) {
            const parsed = JSON.parse(cartData);
            if (parsed.state?.items) {
              // Convertir items del carrito al formato CartItem
              const cartItems: CartItem[] = parsed.state.items.map((item: any) => ({
                id: item.id_prod,
                nombre: item.producto?.nombre || 'Producto sin nombre',
                precio: item.precio_unitario || 0,
                precioSinImpuestos: item.precio_unitario_sin_iva || item.producto?.precio_sin_iva || 0,
                cantidad: item.cantidad || 1,
                img_principal: item.producto?.img_principal || '',
                subtotal: item.subtotal || 0,
                subtotalSinImpuestos: item.subtotal_sin_iva || (item.precio_unitario_sin_iva || item.producto?.precio_sin_iva || 0) * (item.cantidad || 1),
              }));
              set({ cartItems });
            }
          }
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      },

      setCartItems: (items) => set({ cartItems: items }),

      resetCheckout: () => {
        // Obtener valores actuales de ubicación para preservarlos
        const { codigoPostal, ciudad, provincia } = get();
        set({
          currentStep: 1,
          completedSteps: [],
          cartItems: [],
          personalData: null,
          shippingData: null,
          tipoEntrega: null,
          paymentMethod: null,
          costoEnvio: null,
          id_direccion: null,
          isCreatingOrder: false,
          wasGuest: false,
          // Preservar ubicación (ciudad, provincia, codigoPostal) al resetear checkout
          codigoPostal,
          ciudad,
          provincia,
        });
      },
    }),
    {
      name: 'checkout-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        personalData: state.personalData,
        shippingData: state.shippingData,
        tipoEntrega: state.tipoEntrega,
        paymentMethod: state.paymentMethod,
        costoEnvio: state.costoEnvio,
        id_direccion: state.id_direccion,
        codigoPostal: state.codigoPostal,
        ciudad: state.ciudad,
        provincia: state.provincia,
        // wasGuest: no persistir — debe alinearse con auth (estado invitado), no con storage viejo
      }),
      version: 2,
      migrate: (persistedState: unknown, fromVersion: number) => {
        const s = persistedState as Record<string, unknown>;
        const { contactData: _removed, ...rest } = s ?? {};
        let out: Record<string, unknown> = { ...rest };
        if (fromVersion < 2 && out.shippingData != null && typeof out.shippingData === "object" && !Array.isArray(out.shippingData)) {
          const sd = { ...(out.shippingData as Record<string, unknown>) };
          delete sd.retiro_ciudad;
          delete sd.retiro_provincia;
          out = { ...out, shippingData: sd };
        }
        return out;
      },
    }
  )
);

