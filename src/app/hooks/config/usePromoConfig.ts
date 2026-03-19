import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { IConfigTienda } from '@/app/types/config-tienda.type';
import type { UseMutationResult } from '@tanstack/react-query';

type Mutation = UseMutationResult<any, Error, Partial<IConfigTienda>>;

export function usePromoConfig(config: IConfigTienda | undefined, mutation: Mutation) {
    const [envioMin, setEnvioMin] = useState('');
    const [envioActivo, setEnvioActivo] = useState(true);
    const [cuotas, setCuotas] = useState('');
    const [cuotasActivo, setCuotasActivo] = useState(true);
    const [cuotasMin, setCuotasMin] = useState('');

    useEffect(() => {
        if (config) {
            setEnvioMin(String(config.envio_gratis_minimo ?? 100000));
            setEnvioActivo(config.envio_gratis_activo ?? true);
            setCuotas(String(config.cuotas_sin_interes ?? 3));
            setCuotasActivo(config.cuotas_sin_interes_activo ?? true);
            setCuotasMin(String(config.cuotas_sin_interes_minimo ?? 80000));
        }
    }, [config]);

    const defEnvio = config?.envio_gratis_minimo ?? 100000;
    const defEnvioActivo = config?.envio_gratis_activo ?? true;
    const defCuotas = config?.cuotas_sin_interes ?? 3;
    const defCuotasActivo = config?.cuotas_sin_interes_activo ?? true;
    const defCuotasMin = config?.cuotas_sin_interes_minimo ?? 80000;

    const envioVal = parseInt(envioMin.replace(/\D/g, ''), 10);
    const cuotasVal = parseInt(cuotas, 10);
    const cuotasMinVal = parseInt(cuotasMin.replace(/\D/g, ''), 10);

    const hasChanges =
        config != null &&
        ((Number.isNaN(envioVal) ? defEnvio : envioVal) !== defEnvio ||
            envioActivo !== defEnvioActivo ||
            (Number.isNaN(cuotasVal) ? defCuotas : cuotasVal) !== defCuotas ||
            cuotasActivo !== defCuotasActivo ||
            (Number.isNaN(cuotasMinVal) ? defCuotasMin : cuotasMinVal) !== defCuotasMin);

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
        } catch {
            toast.error('Error al guardar la configuración');
        }
    };

    return {
        envioMin, setEnvioMin,
        envioActivo, setEnvioActivo,
        cuotas, setCuotas,
        cuotasActivo, setCuotasActivo,
        cuotasMin, setCuotasMin,
        hasChanges,
        handleSave,
    };
}
