import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PersonalFormData } from '../../schemas/personalForm.schema';
import { ShippingFormData } from '../../schemas/shippingForm.schema';
import { BillingAddressData } from '../../schemas/billingAddress.schema';
import { mapCartItemsToCheckout } from '../../utils/mapCartItemsToCheckout';

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
  billingAddress: BillingAddressData | null;
  shippingData: ShippingFormData | null;
  tipoEntrega: 'envio' | 'retiro' | null;
  paymentMethod: string | null;
  costoEnvio: number | null;
  id_direccion_facturacion: string | null;
  id_direccion_envio: string | null;
  isCreatingOrder: boolean;
  isRedirectingToPayment: boolean;
  wasGuest: boolean;
  codigoPostal: string | null;
  ciudad: string | null;
  provincia: string | null;

  setCurrentStep: (step: 1 | 2 | 3 | 4) => void;
  completeStep: (step: number) => void;
  setPersonalData: (data: PersonalFormData) => void;
  setBillingAddress: (data: BillingAddressData | null) => void;
  setShippingData: (data: ShippingFormData | null) => void;
  setTipoEntrega: (tipo: 'envio' | 'retiro' | null) => void;
  setPaymentMethod: (method: string) => void;
  setCostoEnvio: (costo: number | null) => void;
  setIdDireccionFacturacion: (id: string | null) => void;
  setIdDireccionEnvio: (id: string | null) => void;
  setIsCreatingOrder: (isCreating: boolean) => void;
  setIsRedirectingToPayment: (redirecting: boolean) => void;
  setWasGuest: (wasGuest: boolean) => void;
  setCodigoPostal: (cp: string | null) => void;
  setCiudad: (ciudad: string | null) => void;
  setProvincia: (provincia: string | null) => void;
  clearShippingLocation: () => void;
  loadCartFromLocalStorage: () => void;
  setCartItems: (items: CartItem[]) => void;
  invalidateCheckoutProgress: () => void;
  startNewCheckout: () => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      completedSteps: [],
      cartItems: [],
      personalData: null,
      billingAddress: null,
      shippingData: null,
      tipoEntrega: null,
      paymentMethod: null,
      costoEnvio: null,
      id_direccion_facturacion: null,
      id_direccion_envio: null,
      isCreatingOrder: false,
      isRedirectingToPayment: false,
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
      setBillingAddress: (data) => set({ billingAddress: data }),
      setShippingData: (data) => set({ shippingData: data }),
      setTipoEntrega: (tipo) => set({ tipoEntrega: tipo }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setCostoEnvio: (costo) => set({ costoEnvio: costo }),
      setIdDireccionFacturacion: (id) => set({ id_direccion_facturacion: id }),
      setIdDireccionEnvio: (id) => set({ id_direccion_envio: id }),
      setIsCreatingOrder: (isCreating) => set({ isCreatingOrder: isCreating }),
      setIsRedirectingToPayment: (redirecting) => set({ isRedirectingToPayment: redirecting }),
      setWasGuest: (wasGuest) => set({ wasGuest }),
      setCodigoPostal: (cp) => set({ codigoPostal: cp }),
      setCiudad: (ciudad) => set({ ciudad }),
      setProvincia: (provincia) => set({ provincia }),
      clearShippingLocation: () =>
        set({
          codigoPostal: null,
          ciudad: null,
          provincia: null,
          costoEnvio: null,
        }),

      loadCartFromLocalStorage: () => {
        if (typeof window === 'undefined') return;
        try {
          const cartData = localStorage.getItem('cart-storage');
          if (cartData) {
            const parsed = JSON.parse(cartData);
            if (parsed.state?.items) {
              set({ cartItems: mapCartItemsToCheckout(parsed.state.items) });
            }
          }
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      },

      setCartItems: (items) => set({ cartItems: items }),

      invalidateCheckoutProgress: () =>
        set((state) => ({
          completedSteps: state.completedSteps.filter((s) => s === 1),
          personalData: null,
          billingAddress: null,
          shippingData: null,
          tipoEntrega: null,
          paymentMethod: null,
          costoEnvio: null,
          id_direccion_facturacion: null,
          id_direccion_envio: null,
        })),

      startNewCheckout: () => {
        const { codigoPostal, ciudad, provincia } = get();
        set({
          currentStep: 1,
          completedSteps: [],
          cartItems: [],
          personalData: null,
          billingAddress: null,
          shippingData: null,
          tipoEntrega: null,
          paymentMethod: null,
          costoEnvio: null,
          id_direccion_facturacion: null,
          id_direccion_envio: null,
          isCreatingOrder: false,
          isRedirectingToPayment: false,
          wasGuest: false,
          codigoPostal,
          ciudad,
          provincia,
        });
      },

      resetCheckout: () => {
        const { codigoPostal, ciudad, provincia } = get();
        set({
          currentStep: 1,
          completedSteps: [],
          cartItems: [],
          personalData: null,
          billingAddress: null,
          shippingData: null,
          tipoEntrega: null,
          paymentMethod: null,
          costoEnvio: null,
          id_direccion_facturacion: null,
          id_direccion_envio: null,
          isCreatingOrder: false,
          isRedirectingToPayment: false,
          wasGuest: false,
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
        billingAddress: state.billingAddress,
        shippingData: state.shippingData,
        tipoEntrega: state.tipoEntrega,
        paymentMethod: state.paymentMethod,
        costoEnvio: state.costoEnvio,
        id_direccion_facturacion: state.id_direccion_facturacion,
        id_direccion_envio: state.id_direccion_envio,
        codigoPostal: state.codigoPostal,
        ciudad: state.ciudad,
        provincia: state.provincia,
      }),
      version: 3,
      migrate: (persistedState: unknown, fromVersion: number) => {
        const s = (persistedState ?? {}) as Record<string, unknown>;
        const { contactData: _removed, ...rest } = s;
        let out: Record<string, unknown> = { ...rest };

        if (fromVersion < 2 && out.shippingData != null && typeof out.shippingData === 'object' && !Array.isArray(out.shippingData)) {
          const sd = { ...(out.shippingData as Record<string, unknown>) };
          delete sd.retiro_ciudad;
          delete sd.retiro_provincia;
          out = { ...out, shippingData: sd };
        }

        if (fromVersion < 3) {
          const legacyId = out.id_direccion as string | null | undefined;
          out.id_direccion_facturacion = out.id_direccion_facturacion ?? legacyId ?? null;
          out.id_direccion_envio = out.id_direccion_envio ?? legacyId ?? null;
          delete out.id_direccion;

          if (out.shippingData != null && typeof out.shippingData === 'object' && !Array.isArray(out.shippingData)) {
            const sd = { ...(out.shippingData as Record<string, unknown>) };
            if (sd.mismaDireccionEnvio != null && sd.usarMismaDireccionFacturacion == null) {
              sd.usarMismaDireccionFacturacion = sd.mismaDireccionEnvio;
            }
            out = { ...out, shippingData: sd };
          }
        }

        return out;
      },
    }
  )
);
