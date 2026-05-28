import { describe, it, expect } from 'vitest';
import {
  buildCheckoutOrderExtras,
  resolveCheckoutDireccionPayload,
} from '@/app/utils/buildCheckoutOrderPayload';
import type { PersonalFormData } from '@/app/schemas/personalForm.schema';
import type { BillingAddressData } from '@/app/schemas/billingAddress.schema';
import type { ShippingFormData } from '@/app/schemas/shippingForm.schema';

const billingAddress: BillingAddressData = {
  address: 'San Martin',
  altura: '100',
  city: 'Cordoba',
  state: 'Cordoba',
  postalCode: '5000',
};

const personalData: PersonalFormData = {
  email: 'test@test.com',
  firstName: 'Juan',
  lastName: 'Perez',
  tipoDocumento: 'DNI',
  documento: '12345678',
  phone: '12345678',
  phoneArea: '351',
  necesitaFacturaA: true,
  usarMismosDatosFacturacion: true,
  facturacionA: {
    razonSocial: 'Juan Perez',
    nombreEmpresa: 'Juan Perez',
    cuit: '20123456789',
    domicilioFiscal: 'San Martin 100',
    ciudadFiscal: 'Cordoba',
    provinciaFiscal: 'Cordoba',
    codigoPostalFiscal: '5000',
  },
};

const shippingData: ShippingFormData = {
  tipoEntrega: 'envio',
  address: 'Otra Calle',
  altura: '200',
  city: 'Rosario',
  state: 'Santa Fe',
  postalCode: '2000',
  usarMismaDireccionFacturacion: false,
};

describe('buildCheckoutOrderPayload', () => {
  it('retiro uses billing address', () => {
    const result = resolveCheckoutDireccionPayload({
      tipoEntrega: 'retiro',
      billingAddress,
      shippingData: { ...shippingData, tipoEntrega: 'retiro' },
      fullPhone: '35112345678',
      id_direccion_facturacion: null,
      id_direccion_envio: null,
    });

    expect(result.direccion?.direccion).toBe('San Martin');
    expect(result.direccion?.altura).toBe('100');
    expect(result.direccion?.ciudad).toBe('Cordoba');
  });

  it('envio uses shipping address when different from billing', () => {
    const result = resolveCheckoutDireccionPayload({
      tipoEntrega: 'envio',
      billingAddress,
      shippingData,
      fullPhone: '35112345678',
      id_direccion_facturacion: null,
      id_direccion_envio: null,
    });

    expect(result.direccion?.direccion).toBe('Otra Calle');
    expect(result.direccion?.ciudad).toBe('Rosario');
  });

  it('factura A sends CUIT and referencia', () => {
    const extras = buildCheckoutOrderExtras(personalData, billingAddress);
    expect(extras.tipo_documento).toBe('CUIT');
    expect(extras.numero_documento).toBe('20123456789');
    expect(extras.referencia_facturacion).toContain('FA');
    expect(extras.referencia_facturacion).toContain('20123456789');
  });
});
