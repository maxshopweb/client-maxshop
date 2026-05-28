import type { PersonalFormData } from '@/app/schemas/personalForm.schema';
import type { BillingAddressData } from '@/app/schemas/billingAddress.schema';

export function buildReferenciaFacturacion(
  personalData: PersonalFormData,
  billingAddress: BillingAddressData | null
): string | undefined {
  if (!personalData.necesitaFacturaA || !personalData.facturacionA) return undefined;

  const fa = personalData.facturacionA;
  const razon = fa.razonSocial?.trim() || '';
  const cuit =
    fa.cuit?.trim() ||
    (personalData.usarMismosDatosFacturacion && personalData.tipoDocumento === 'CUIT'
      ? personalData.documento
      : '');

  const domicilio =
    fa.domicilioFiscal?.trim() ||
    (billingAddress
      ? `${billingAddress.address} ${billingAddress.altura}`.trim()
      : '');

  const ciudad = fa.ciudadFiscal?.trim() || billingAddress?.city?.trim() || '';

  const parts = ['FA'];
  if (razon) parts.push(razon);
  if (cuit) parts.push(`CUIT ${cuit}`);
  if (domicilio || ciudad) {
    parts.push([domicilio, ciudad].filter(Boolean).join(', '));
  }

  const ref = parts.join(' | ').slice(0, 100);
  return ref.length > 3 ? ref : undefined;
}
