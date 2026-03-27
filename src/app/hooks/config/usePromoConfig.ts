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

  useEffect(() => {
    if (config) {
      setEnvioMin(String(config.envio_gratis_minimo ?? DEFAULT_REGLAS_NEGOCIO.envio_gratis_minimo));
      setEnvioActivo(config.envio_gratis_activo ?? DEFAULT_REGLAS_NEGOCIO.envio_gratis_activo);
      setCuotas(String(config.cuotas_sin_interes ?? DEFAULT_REGLAS_NEGOCIO.cuotas_sin_interes));
      setCuotasActivo(config.cuotas_sin_interes_activo ?? DEFAULT_REGLAS_NEGOCIO.cuotas_sin_interes_activo);
      setCuotasMin(String(config.cuotas_sin_interes_minimo ?? DEFAULT_REGLAS_NEGOCIO.cuotas_sin_interes_minimo));
    } else if (!isLoading) {
      setEnvioMin(String(DEFAULT_REGLAS_NEGOCIO.envio_gratis_minimo));
      setEnvioActivo(DEFAULT_REGLAS_NEGOCIO.envio_gratis_activo);
      setCuotas(String(DEFAULT_REGLAS_NEGOCIO.cuotas_sin_interes));
      setCuotasActivo(DEFAULT_REGLAS_NEGOCIO.cuotas_sin_interes_activo);
      setCuotasMin(String(DEFAULT_REGLAS_NEGOCIO.cuotas_sin_interes_minimo));
    }
  }, [config, isLoading]);

  const baseline = useMemo(() => baselineFromConfig(config), [config]);

  const envioVal = parseInt(envioMin.replace(/\D/g, ''), 10);
  const cuotasVal = parseInt(cuotas, 10);
  const cuotasMinVal = parseInt(cuotasMin.replace(/\D/g, ''), 10);

  const resolvedEnvio = Number.isNaN(envioVal) ? baseline.envio_gratis_minimo : envioVal;
  const resolvedCuotas = Number.isNaN(cuotasVal) ? baseline.cuotas_sin_interes : cuotasVal;
  const resolvedCuotasMin = Number.isNaN(cuotasMinVal) ? baseline.cuotas_sin_interes_minimo : cuotasMinVal;

  const hasChanges =
    resolvedEnvio !== baseline.envio_gratis_minimo ||
    envioActivo !== baseline.envio_gratis_activo ||
    resolvedCuotas !== baseline.cuotas_sin_interes ||
    cuotasActivo !== baseline.cuotas_sin_interes_activo ||
    resolvedCuotasMin !== baseline.cuotas_sin_interes_minimo;

  const handleSave = async () => {
    const envio = parseInt(envioMin.replace(/\D/g, ''), 10);
    const nCuotas = parseInt(cuotas, 10);
    const minCuotas = parseInt(cuotasMin.replace(/\D/g, ''), 10);

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

    try {
      await mutation.mutateAsync({
        envio_gratis_minimo: envio,
        envio_gratis_activo: envioActivo,
        cuotas_sin_interes: nCuotas,
        cuotas_sin_interes_activo: cuotasActivo,
        cuotas_sin_interes_minimo: minCuotas,
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
    hasChanges,
    handleSave,
  };
}
