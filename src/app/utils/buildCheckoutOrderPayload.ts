import type { PersonalFormData } from '@/app/schemas/personalForm.schema';
import type { BillingAddressData } from '@/app/schemas/billingAddress.schema';
import type { ShippingFormData } from '@/app/schemas/shippingForm.schema';
import { buildReferenciaFacturacion } from './buildReferenciaFacturacion';

type AddressSource = {
  address?: string;
  altura?: string;
  piso?: string;
  dpto?: string;
  city?: string;
  state?: string;
  postalCode?: string;
};

function buildDireccionFromSource(source: AddressSource, fullPhone: string) {
  const rawCp = source.postalCode?.trim();
  let cod_postal: number | null = null;
  if (rawCp) {
    const parsed = parseInt(rawCp, 10);
    cod_postal = !isNaN(parsed) && parsed > 0 ? parsed : null;
  }

  return {
    direccion: source.address || '',
    altura: source.altura || '',
    piso: source.piso || undefined,
    dpto: source.dpto || undefined,
    ciudad: source.city || '',
    provincia: source.state || '',
    cod_postal,
    telefono: fullPhone,
  };
}

export function resolveCheckoutDocumentPayload(personalData: PersonalFormData) {
  if (personalData.necesitaFacturaA) {
    const cuit =
      personalData.facturacionA?.cuit?.trim() ||
      (personalData.usarMismosDatosFacturacion && personalData.tipoDocumento === 'CUIT'
        ? personalData.documento
        : undefined);

    return {
      tipo_documento: 'CUIT' as const,
      numero_documento: cuit,
    };
  }

  return {
    tipo_documento: personalData.tipoDocumento || undefined,
    numero_documento: personalData.documento || undefined,
  };
}

export function resolveCheckoutDireccionPayload(options: {
  tipoEntrega: 'envio' | 'retiro';
  billingAddress: BillingAddressData | null;
  shippingData: ShippingFormData;
  fullPhone: string;
  id_direccion_facturacion: string | null;
  id_direccion_envio: string | null;
}) {
  const {
    tipoEntrega,
    billingAddress,
    shippingData,
    fullPhone,
    id_direccion_facturacion,
    id_direccion_envio,
  } = options;

  if (tipoEntrega === 'retiro') {
    if (id_direccion_facturacion) {
      return { id_direccion: id_direccion_facturacion, direccion: undefined };
    }
    if (!billingAddress) return { id_direccion: undefined, direccion: undefined };
    return {
      id_direccion: undefined,
      direccion: buildDireccionFromSource(billingAddress, fullPhone),
    };
  }

  if (tipoEntrega === 'envio') {
    const idDireccion =
      id_direccion_envio ||
      (shippingData.usarMismaDireccionFacturacion ? id_direccion_facturacion : null);

    if (idDireccion) {
      return { id_direccion: idDireccion, direccion: undefined };
    }

    if (!shippingData.postalCode) {
      return { id_direccion: undefined, direccion: undefined };
    }

    return {
      id_direccion: undefined,
      direccion: buildDireccionFromSource(shippingData, fullPhone),
    };
  }

  return { id_direccion: undefined, direccion: undefined };
}

export function buildCheckoutOrderExtras(
  personalData: PersonalFormData,
  billingAddress: BillingAddressData | null
) {
  return {
    ...resolveCheckoutDocumentPayload(personalData),
    referencia_facturacion: buildReferenciaFacturacion(personalData, billingAddress),
  };
}
