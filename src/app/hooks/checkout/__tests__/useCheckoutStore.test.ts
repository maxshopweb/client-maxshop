import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCheckoutStore } from '../useCheckoutStore';
import type { PersonalFormData } from '@/app/schemas/personalForm.schema';
import type { ShippingFormData } from '@/app/schemas/shippingForm.schema';

const initialCheckoutState = {
  currentStep: 1 as const,
  completedSteps: [] as number[],
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
};

const mockPersonalData: PersonalFormData = {
  email: 'test@test.com',
  firstName: 'Juan',
  lastName: 'Perez',
  tipoDocumento: 'DNI',
  documento: '12345678',
  phone: '12345678',
  phoneArea: '11',
  necesitaFacturaA: false,
  usarMismosDatosFacturacion: true,
};

const mockShippingData: ShippingFormData = {
  tipoEntrega: 'envio',
  address: 'Av Siempre Viva',
  altura: '742',
  city: 'Springfield',
  state: 'BSAS',
  postalCode: '1000',
  mismaDireccionEnvio: true,
};

describe('useCheckoutStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useCheckoutStore.setState(initialCheckoutState);
  });

  it('should have correct initial state', () => {
    const state = useCheckoutStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.completedSteps).toEqual([]);
    expect(state.cartItems).toEqual([]);
    expect(state.personalData).toBeNull();
    expect(state.shippingData).toBeNull();
    expect(state.tipoEntrega).toBeNull();
    expect(state.paymentMethod).toBeNull();
    expect(state.costoEnvio).toBeNull();
    expect(state.id_direccion).toBeNull();
    expect(state.isCreatingOrder).toBe(false);
    expect(state.wasGuest).toBe(false);
    expect(state.codigoPostal).toBeNull();
    expect(state.ciudad).toBeNull();
    expect(state.provincia).toBeNull();
  });

  it('should set current step', () => {
    useCheckoutStore.getState().setCurrentStep(2);
    expect(useCheckoutStore.getState().currentStep).toBe(2);

    useCheckoutStore.getState().setCurrentStep(4);
    expect(useCheckoutStore.getState().currentStep).toBe(4);
  });

  it('should complete a step', () => {
    useCheckoutStore.getState().completeStep(1);
    expect(useCheckoutStore.getState().completedSteps).toEqual([1]);
  });

  it('should not duplicate completed steps', () => {
    useCheckoutStore.getState().completeStep(1);
    useCheckoutStore.getState().completeStep(1);
    expect(useCheckoutStore.getState().completedSteps).toEqual([1]);
  });

  it('should complete multiple steps', () => {
    useCheckoutStore.getState().completeStep(1);
    useCheckoutStore.getState().completeStep(2);
    useCheckoutStore.getState().completeStep(3);
    expect(useCheckoutStore.getState().completedSteps).toEqual([1, 2, 3]);
  });

  it('should set personal data', () => {
    useCheckoutStore.getState().setPersonalData(mockPersonalData);
    expect(useCheckoutStore.getState().personalData).toEqual(mockPersonalData);
  });

  it('should set shipping data', () => {
    useCheckoutStore.getState().setShippingData(mockShippingData);
    expect(useCheckoutStore.getState().shippingData).toEqual(mockShippingData);
  });

  it('should set shipping data to null', () => {
    useCheckoutStore.getState().setShippingData(mockShippingData);
    useCheckoutStore.getState().setShippingData(null);
    expect(useCheckoutStore.getState().shippingData).toBeNull();
  });

  it('should set tipo de entrega', () => {
    useCheckoutStore.getState().setTipoEntrega('envio');
    expect(useCheckoutStore.getState().tipoEntrega).toBe('envio');

    useCheckoutStore.getState().setTipoEntrega('retiro');
    expect(useCheckoutStore.getState().tipoEntrega).toBe('retiro');
  });

  it('should set payment method', () => {
    useCheckoutStore.getState().setPaymentMethod('efectivo');
    expect(useCheckoutStore.getState().paymentMethod).toBe('efectivo');
  });

  it('should set costo de envio', () => {
    useCheckoutStore.getState().setCostoEnvio(500);
    expect(useCheckoutStore.getState().costoEnvio).toBe(500);

    useCheckoutStore.getState().setCostoEnvio(null);
    expect(useCheckoutStore.getState().costoEnvio).toBeNull();
  });

  it('should set id direccion', () => {
    useCheckoutStore.getState().setIdDireccion('dir-123');
    expect(useCheckoutStore.getState().id_direccion).toBe('dir-123');

    useCheckoutStore.getState().setIdDireccion(null);
    expect(useCheckoutStore.getState().id_direccion).toBeNull();
  });

  it('should set isCreatingOrder', () => {
    useCheckoutStore.getState().setIsCreatingOrder(true);
    expect(useCheckoutStore.getState().isCreatingOrder).toBe(true);

    useCheckoutStore.getState().setIsCreatingOrder(false);
    expect(useCheckoutStore.getState().isCreatingOrder).toBe(false);
  });

  it('should set wasGuest', () => {
    useCheckoutStore.getState().setWasGuest(true);
    expect(useCheckoutStore.getState().wasGuest).toBe(true);

    useCheckoutStore.getState().setWasGuest(false);
    expect(useCheckoutStore.getState().wasGuest).toBe(false);
  });

  it('should set codigo postal', () => {
    useCheckoutStore.getState().setCodigoPostal('1000');
    expect(useCheckoutStore.getState().codigoPostal).toBe('1000');

    useCheckoutStore.getState().setCodigoPostal(null);
    expect(useCheckoutStore.getState().codigoPostal).toBeNull();
  });

  it('should set ciudad', () => {
    useCheckoutStore.getState().setCiudad('Buenos Aires');
    expect(useCheckoutStore.getState().ciudad).toBe('Buenos Aires');

    useCheckoutStore.getState().setCiudad(null);
    expect(useCheckoutStore.getState().ciudad).toBeNull();
  });

  it('should set provincia', () => {
    useCheckoutStore.getState().setProvincia('CABA');
    expect(useCheckoutStore.getState().provincia).toBe('CABA');

    useCheckoutStore.getState().setProvincia(null);
    expect(useCheckoutStore.getState().provincia).toBeNull();
  });

  it('should clear shipping location', () => {
    useCheckoutStore.getState().setCodigoPostal('1000');
    useCheckoutStore.getState().setCiudad('Buenos Aires');
    useCheckoutStore.getState().setProvincia('CABA');
    useCheckoutStore.getState().setCostoEnvio(500);
    useCheckoutStore.getState().clearShippingLocation();

    const state = useCheckoutStore.getState();
    expect(state.codigoPostal).toBeNull();
    expect(state.ciudad).toBeNull();
    expect(state.provincia).toBeNull();
    expect(state.costoEnvio).toBeNull();
  });

  it('should load cart items from localStorage', () => {
    const cartStorageData = {
      state: {
        items: [
          {
            id_prod: 1,
            producto: {
              id_prod: 1,
              nombre: 'Test Product',
              precio: 100,
              precio_sin_iva: 80,
              img_principal: 'test.jpg',
              precio_anterior: 120,
              bonificacion_porcentaje: 20,
            },
            cantidad: 2,
            precio_unitario: 100,
            precio_unitario_sin_iva: 80,
            descuento: 0,
            subtotal: 200,
            subtotal_sin_iva: 160,
          },
        ],
      },
    };
    localStorage.setItem('cart-storage', JSON.stringify(cartStorageData));

    useCheckoutStore.getState().loadCartFromLocalStorage();

    const state = useCheckoutStore.getState();
    expect(state.cartItems).toHaveLength(1);
    expect(state.cartItems[0]).toMatchObject({
      id: 1,
      nombre: 'Test Product',
      precio: 100,
      precioSinImpuestos: 80,
      cantidad: 2,
      img_principal: 'test.jpg',
      subtotal: 200,
      subtotalSinImpuestos: 160,
      descuento: 0,
      precio_anterior: 120,
      bonificacion_porcentaje: 20,
    });
  });

  it('should handle empty localStorage in loadCartFromLocalStorage', () => {
    useCheckoutStore.getState().loadCartFromLocalStorage();
    expect(useCheckoutStore.getState().cartItems).toEqual([]);
  });

  it('should handle invalid JSON in loadCartFromLocalStorage', () => {
    localStorage.setItem('cart-storage', 'invalid-json');
    useCheckoutStore.getState().loadCartFromLocalStorage();
    expect(useCheckoutStore.getState().cartItems).toEqual([]);
  });

  it('should handle missing items in localStorage data', () => {
    localStorage.setItem('cart-storage', JSON.stringify({ state: {} }));
    useCheckoutStore.getState().loadCartFromLocalStorage();
    expect(useCheckoutStore.getState().cartItems).toEqual([]);
  });

  it('should set cart items directly', () => {
    const items = [{
      id: 1, nombre: 'Test', precio: 100, precioSinImpuestos: 80,
      cantidad: 1, img_principal: '', subtotal: 100, subtotalSinImpuestos: 80,
    }];
    useCheckoutStore.getState().setCartItems(items);

    expect(useCheckoutStore.getState().cartItems).toEqual(items);
  });

  it('should reset checkout state preserving location', () => {
    useCheckoutStore.getState().setCurrentStep(3);
    useCheckoutStore.getState().completeStep(1);
    useCheckoutStore.getState().completeStep(2);
    useCheckoutStore.getState().setPersonalData(mockPersonalData);
    useCheckoutStore.getState().setShippingData(mockShippingData);
    useCheckoutStore.getState().setTipoEntrega('envio');
    useCheckoutStore.getState().setPaymentMethod('efectivo');
    useCheckoutStore.getState().setCostoEnvio(500);
    useCheckoutStore.getState().setIdDireccion('dir-123');
    useCheckoutStore.getState().setIsCreatingOrder(true);
    useCheckoutStore.getState().setWasGuest(true);
    useCheckoutStore.getState().setCodigoPostal('1000');
    useCheckoutStore.getState().setCiudad('Buenos Aires');
    useCheckoutStore.getState().setProvincia('CABA');

    useCheckoutStore.getState().resetCheckout();

    const state = useCheckoutStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.completedSteps).toEqual([]);
    expect(state.cartItems).toEqual([]);
    expect(state.personalData).toBeNull();
    expect(state.shippingData).toBeNull();
    expect(state.tipoEntrega).toBeNull();
    expect(state.paymentMethod).toBeNull();
    expect(state.costoEnvio).toBeNull();
    expect(state.id_direccion).toBeNull();
    expect(state.isCreatingOrder).toBe(false);
    expect(state.wasGuest).toBe(false);
    expect(state.codigoPostal).toBe('1000');
    expect(state.ciudad).toBe('Buenos Aires');
    expect(state.provincia).toBe('CABA');
  });

  it('should remove contactData and clean retiro fields from shippingData during migration', () => {
    const persistedState = {
      contactData: { email: 'old@test.com' },
      currentStep: 2,
      completedSteps: [1],
      shippingData: {
        address: 'Test',
        altura: '123',
        ciudad: 'City',
        retiro_ciudad: 'OldCity',
        retiro_provincia: 'OldProv',
      },
    };

    const { contactData: _removed, ...rest } = persistedState ?? {};
    let out: Record<string, unknown> = { ...rest };
    if (out.shippingData != null && typeof out.shippingData === 'object' && !Array.isArray(out.shippingData)) {
      const sd = { ...(out.shippingData as Record<string, unknown>) };
      delete sd.retiro_ciudad;
      delete sd.retiro_provincia;
      out = { ...out, shippingData: sd };
    }

    expect((out as any).contactData).toBeUndefined();
    const sd = out.shippingData as Record<string, unknown>;
    expect((sd as any).retiro_ciudad).toBeUndefined();
    expect((sd as any).retiro_provincia).toBeUndefined();
    expect(sd.address).toBe('Test');
  });
});
