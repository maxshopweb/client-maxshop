/** Valor en venta.observaciones cuando el checkout elige retiro; debe contener "retiro en tienda" (api-maxshop venta-envio.validation / AndreaniHandler). */
export const OBSERVACION_RETIRO_EN_TIENDA = "Retiro en tienda";

/** Alineado con api-maxshop venta-envio.validation / AndreaniHandler */
export function isVentaRetiroEnTienda(observaciones: string | null | undefined): boolean {
    const o = observaciones?.toLowerCase() ?? '';
    return o.includes('retiro en tienda') || o.includes('tipo: retiro');
}

export function hasDireccionCompletaParaEnvio(input: {
    direccion?: string | null;
    ciudad?: string | null;
    cod_postal?: number | string | null;
}): boolean {
    const dir = input.direccion?.trim();
    const city = input.ciudad?.trim();
    const cp = input.cod_postal != null && input.cod_postal !== '' ? String(input.cod_postal).trim() : '';
    if (!dir || !city || !cp || cp === '0' || cp === '0000') return false;
    return true;
}
