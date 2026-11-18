import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import type { IConfigTienda } from '@/app/types/config-tienda.type';
import type { UseMutationResult } from '@tanstack/react-query';

type Mutation = UseMutationResult<unknown, Error, Partial<IConfigTienda>>;

/** Alineado con `DEFAULTS` en `backend/src/services/config-tienda.service.ts` */
const DEFAULT_REGLAS_NEGOCIO = {
  envio_gratis_minimo: 100000,
  envio_gratis_activo: true,
  cuotas_sin_interes: 3,
  cuotas_sin_interes_activo: true,
  cuotas_sin_interes_minimo: 80000,
  descuento_transferencia_activo: false,
  descuento_transferencia_pct: 0,
} as const;

function baselineFromConfig(config: IConfigTienda | undefined) {
  return {
    envio_gratis_minimo: Number(config?.envio_gratis_minimo ?? DEFAULT_REGLAS_NEGOCIO.envio_gratis_minimo),
    envio_gratis_activo: config?.envio_gratis_activo ?? DEFAULT_REGLAS_NEGOCIO.envio_gratis_activo,
    cuotas_sin_interes: Number(config?.cuotas_sin_interes ?? DEFAULT_REGLAS_NEGOCIO.cuotas_sin_interes),
    cuotas_sin_interes_activo:
      config?.cuotas_sin_interes_activo ?? DEFAULT_REGLAS_NEGOCIO.cuotas_sin_interes_activo,
    cuotas_sin_interes_minimo: Number(
      config?.cuotas_sin_interes_minimo ?? DEFAULT_REGLAS_NEGOCIO.cuotas_sin_interes_minimo
    ),
    descuento_transferencia_activo:
      config?.descuento_transferencia_activo ?? DEFAULT_REGLAS_NEGOCIO.descuento_transferencia_activo,
    descuento_transferencia_pct: Number(
      config?.descuento_transferencia_pct ?? DEFAULT_REGLAS_NEGOCIO.descuento_transferencia_pct
    ),
  };
}

function parseApiError(err: unknown): string {
  if (isAxiosError(err) && err.response?.data && typeof err.response.data === 'object') {
    const d = err.response.data as { error?: string; details?: { message?: string }[] };
    const parts = d.details?.map((x) => x.message).filter(Boolean);
    if (parts?.length) return parts.join(' · ');
    if (typeof d.error === 'string' && d.error) return d.error;
  }
  if (err instanceof Error && err.message) return err.message;
  return 'Error al guardar la configuración';
}

export function usePromoConfig(
  config: IConfigTienda | undefined,
  mutation: Mutation,
  isLoading: boolean
) {
  const [envioMin, setEnvioMin] = useState('');
  const [envioActivo, setEnvioActivo] = useState(true);
  const [cuotas, setCuotas] = useState('');
  const [cuotasActivo, setCuotasActivo] = useState(true);
  const [cuotasMin, setCuotasMin] = useState('');
  const [transferActivo, setTransferActivo] = useState(false);
  const [transferPct, setTransferPct] = useState('0');

  useEffect(() => {
    if (config) {
      setEnvioMin(String(config.envio_gratis_minimo ?? DEFAULT_REGLAS_NEGOCIO.envio_gratis_minimo));
      setEnvioActivo(config.envio_gratis_activo ?? DEFAULT_REGLAS_NEGOCIO.envio_gratis_activo);
      setCuotas(String(config.cuotas_sin_interes ?? DEFAULT_REGLAS_NEGOCIO.cuotas_sin_interes));
      setCuotasActivo(config.cuotas_sin_interes_activo ?? DEFAULT_REGLAS_NEGOCIO.cuotas_sin_interes_activo);
      setCuotasMin(String(config.cuotas_sin_interes_minimo ?? DEFAULT_REGLAS_NEGOCIO.cuotas_sin_interes_minimo));
      setTransferActivo(
        config.descuento_transferencia_activo ?? DEFAULT_REGLAS_NEGOCIO.descuento_transferencia_activo
      );
      setTransferPct(
        String(config.descuento_transferencia_pct ?? DEFAULT_REGLAS_NEGOCIO.descuento_transferencia_pct)
      );
    } else if (!isLoading) {
      setEnvioMin(String(DEFAULT_REGLAS_NEGOCIO.envio_gratis_minimo));
      setEnvioActivo(DEFAULT_REGLAS_NEGOCIO.envio_gratis_activo);
      setCuotas(String(DEFAULT_REGLAS_NEGOCIO.cuotas_sin_interes));
      setCuotasActivo(DEFAULT_REGLAS_NEGOCIO.cuotas_sin_interes_activo);
      setCuotasMin(String(DEFAULT_REGLAS_NEGOCIO.cuotas_sin_interes_minimo));
      setTransferActivo(DEFAULT_REGLAS_NEGOCIO.descuento_transferencia_activo);
      setTransferPct(String(DEFAULT_REGLAS_NEGOCIO.descuento_transferencia_pct));
    }
  }, [config, isLoading]);

  const baseline = useMemo(() => baselineFromConfig(config), [config]);

  const envioVal = parseInt(envioMin.replace(/\D/g, ''), 10);
  const cuotasVal = parseInt(cuotas, 10);
  const cuotasMinVal = parseInt(cuotasMin.replace(/\D/g, ''), 10);
  const transferPctVal = parseFloat(transferPct.replace(',', '.'));

  const resolvedEnvio = Number.isNaN(envioVal) ? baseline.envio_gratis_minimo : envioVal;
  const resolvedCuotas = Number.isNaN(cuotasVal) ? baseline.cuotas_sin_interes : cuotasVal;
  const resolvedCuotasMin = Number.isNaN(cuotasMinVal) ? baseline.cuotas_sin_interes_minimo : cuotasMinVal;
  const resolvedTransferPct = Number.isNaN(transferPctVal)
    ? baseline.descuento_transferencia_pct
    : transferPctVal;

  const hasChanges =
    resolvedEnvio !== baseline.envio_gratis_minimo ||
    envioActivo !== baseline.envio_gratis_activo ||
    resolvedCuotas !== baseline.cuotas_sin_interes ||
    cuotasActivo !== baseline.cuotas_sin_interes_activo ||
    resolvedCuotasMin !== baseline.cuotas_sin_interes_minimo ||
    transferActivo !== baseline.descuento_transferencia_activo ||
    resolvedTransferPct !== baseline.descuento_transferencia_pct;

  const handleSave = async () => {
    const envio = parseInt(envioMin.replace(/\D/g, ''), 10);
    const nCuotas = parseInt(cuotas, 10);
    const minCuotas = parseInt(cuotasMin.replace(/\D/g, ''), 10);
    const pct = parseFloat(transferPct.replace(',', '.'));

    if (isNaN(envio) || envio < 0) {
      toast.error('Monto mínimo de envío gratis inválido');
      return;
    }
    if (isNaN(nCuotas) || nCuotas < 1) {
      toast.error('Cantidad de cuotas inválida');
      return;
    }
    if (isNaN(minCuotas) || minCuotas < 0) {
      toast.error('Monto mínimo para cuotas inválido');
      return;
    }
    if (isNaN(pct) || pct < 0 || pct > 100) {
      toast.error('El descuento por transferencia debe estar entre 0 y 100');
      return;
    }

    try {
      await mutation.mutateAsync({
        envio_gratis_minimo: envio,
        envio_gratis_activo: envioActivo,
        cuotas_sin_interes: nCuotas,
        cuotas_sin_interes_activo: cuotasActivo,
        cuotas_sin_interes_minimo: minCuotas,
        descuento_transferencia_activo: transferActivo,
        descuento_transferencia_pct: pct,
      });
      toast.success('Configuración guardada. Los mensajes se actualizarán en toda la tienda.');
    } catch (err) {
      toast.error(parseApiError(err));
    }
  };

  return {
    envioMin,
    setEnvioMin,
    envioActivo,
    setEnvioActivo,
    cuotas,
    setCuotas,
    cuotasActivo,
    setCuotasActivo,
    cuotasMin,
    setCuotasMin,
    transferActivo,
    setTransferActivo,
    transferPct,
    setTransferPct,
    hasChanges,
    handleSave,
  };
}
