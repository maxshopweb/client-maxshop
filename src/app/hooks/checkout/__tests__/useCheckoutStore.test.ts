import { describe, it, expect, beforeEach } from 'vitest';

import { useCheckoutStore } from '../useCheckoutStore';

import type { PersonalFormData } from '@/app/schemas/personalForm.schema';

import type { ShippingFormData } from '@/app/schemas/shippingForm.schema';

import type { BillingAddressData } from '@/app/schemas/billingAddress.schema';



const initialCheckoutState = {

  currentStep: 1 as const,

  completedSteps: [] as number[],

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



const mockBillingAddress: BillingAddressData = {

  address: 'San Martin',

  altura: '123',

  city: 'Cordoba',

  state: 'Cordoba',

  postalCode: '5000',

};



const mockShippingData: ShippingFormData = {

  tipoEntrega: 'envio',

  address: 'Av Siempre Viva',

  altura: '742',

  city: 'Springfield',

  state: 'BSAS',

  postalCode: '1000',

  usarMismaDireccionFacturacion: true,

};



describe('useCheckoutStore', () => {

  beforeEach(() => {

    localStorage.clear();

    useCheckoutStore.setState(initialCheckoutState);

  });



  it('should have correct initial state', () => {

    const state = useCheckoutStore.getState();

    expect(state.currentStep).toBe(1);

    expect(state.billingAddress).toBeNull();

    expect(state.id_direccion_facturacion).toBeNull();

    expect(state.id_direccion_envio).toBeNull();

  });



  it('should set billing address', () => {

    useCheckoutStore.getState().setBillingAddress(mockBillingAddress);

    expect(useCheckoutStore.getState().billingAddress).toEqual(mockBillingAddress);

  });



  it('should set id direccion facturacion and envio', () => {

    useCheckoutStore.getState().setIdDireccionFacturacion('dir-bill');

    useCheckoutStore.getState().setIdDireccionEnvio('dir-ship');

    expect(useCheckoutStore.getState().id_direccion_facturacion).toBe('dir-bill');

    expect(useCheckoutStore.getState().id_direccion_envio).toBe('dir-ship');

  });



  it('should set personal data', () => {

    useCheckoutStore.getState().setPersonalData(mockPersonalData);

    expect(useCheckoutStore.getState().personalData).toEqual(mockPersonalData);

  });



  it('should set shipping data', () => {

    useCheckoutStore.getState().setShippingData(mockShippingData);

    expect(useCheckoutStore.getState().shippingData).toEqual(mockShippingData);

  });



  it('should invalidate checkout progress clearing billing', () => {

    useCheckoutStore.getState().completeStep(1);

    useCheckoutStore.getState().completeStep(2);

    useCheckoutStore.getState().setBillingAddress(mockBillingAddress);

    useCheckoutStore.getState().setPersonalData(mockPersonalData);



    useCheckoutStore.getState().invalidateCheckoutProgress();



    const state = useCheckoutStore.getState();

    expect(state.completedSteps).toEqual([1]);

    expect(state.billingAddress).toBeNull();

    expect(state.personalData).toBeNull();

  });



  it('should reset checkout state preserving location', () => {

    useCheckoutStore.getState().setBillingAddress(mockBillingAddress);

    useCheckoutStore.getState().setIdDireccionFacturacion('dir-123');

    useCheckoutStore.getState().setCodigoPostal('1000');

    useCheckoutStore.getState().setCiudad('Buenos Aires');

    useCheckoutStore.getState().setProvincia('CABA');



    useCheckoutStore.getState().resetCheckout();



    const state = useCheckoutStore.getState();

    expect(state.billingAddress).toBeNull();

    expect(state.id_direccion_facturacion).toBeNull();

    expect(state.codigoPostal).toBe('1000');

  });

});

