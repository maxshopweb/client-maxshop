import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PersonalFormData } from '../../schemas/personalForm.schema';
import { ShippingFormData } from '../../schemas/shippingForm.schema';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  img_principal: string;
  subtotal: number;
}

interface CheckoutStore {
  currentStep: 1 | 2 | 3 | 4;
  completedSteps: number[];
  cartItems: CartItem[];
  personalData: PersonalFormData | null; // Renombrado de contactData
  shippingData: ShippingFormData | null; // Nuevo: datos de envío
  tipoEntrega: 'envio' | 'retiro' | null; // Nuevo: tipo de entrega
  paymentMethod: string | null;
  costoEnvio: number | null; // Costo de envío calculado
  id_direccion: string | null; // ID de dirección guardada seleccionada
  isCreatingOrder: boolean; // Estado para el loader de transición
  wasGuest: boolean; // Si el usuario era invitado al completar el checkout

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
  loadCartFromLocalStorage: () => void;
  setCartItems: (items: CartItem[]) => void;
  resetCheckout: () => void;
  
  // Deprecated: mantener para compatibilidad temporal
  contactData: PersonalFormData | null;
  setContactData: (data: PersonalFormData) => void;
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
      
      // Deprecated: mantener para compatibilidad
      contactData: null,

      setCurrentStep: (step) => set({ currentStep: step }),

      completeStep: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step],
        })),

      setPersonalData: (data) => set({ personalData: data, contactData: data }), // Mantener compatibilidad
      
      setShippingData: (data) => set({ shippingData: data }),

      setTipoEntrega: (tipo) => set({ tipoEntrega: tipo }),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      setCostoEnvio: (costo) => set({ costoEnvio: costo }),
      
      setIdDireccion: (id) => set({ id_direccion: id }),
      
      setIsCreatingOrder: (isCreating) => set({ isCreatingOrder: isCreating }),
      
      setWasGuest: (wasGuest) => set({ wasGuest }),
      
      // Deprecated: mantener para compatibilidad
      setContactData: (data) => set({ personalData: data, contactData: data }),

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
                cantidad: item.cantidad || 1,
                img_principal: item.producto?.img_principal || '',
                subtotal: item.subtotal || 0,
              }));
              set({ cartItems });
            }
          }
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      },

      setCartItems: (items) => set({ cartItems: items }),

      resetCheckout: () =>
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
          contactData: null, // Deprecated
        }),
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
        wasGuest: state.wasGuest, // Persistir para que esté disponible después de recargar
        // Deprecated: mantener para compatibilidad
        contactData: state.contactData,
        // No persistir cartItems, se cargan desde cartStore
      }),
    }
  )
);

