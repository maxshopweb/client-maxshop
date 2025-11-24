import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ContactFormData } from '../schemas/contactForm.schema';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  img_principal: string;
  subtotal: number;
}

interface CheckoutStore {
  currentStep: 1 | 2 | 3;
  completedSteps: number[];
  cartItems: CartItem[];
  contactData: ContactFormData | null;
  paymentMethod: string | null;

  setCurrentStep: (step: 1 | 2 | 3) => void;
  completeStep: (step: number) => void;
  setContactData: (data: ContactFormData) => void;
  setPaymentMethod: (method: string) => void;
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
      contactData: null,
      paymentMethod: null,

      setCurrentStep: (step) => set({ currentStep: step }),

      completeStep: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step],
        })),

      setContactData: (data) => set({ contactData: data }),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

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
          contactData: null,
          paymentMethod: null,
        }),
    }),
    {
      name: 'checkout-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        contactData: state.contactData,
        paymentMethod: state.paymentMethod,
        // No persistir cartItems, se cargan desde cartStore
      }),
    }
  )
);

