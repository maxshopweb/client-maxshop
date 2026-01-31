"use client";

import { useEffect, useRef } from "react";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";
import { useCartStore } from "@/app/stores/cartStore";
import { useCotizarEnvio } from "@/app/hooks/checkout/useCotizarEnvio";

interface UseAutoCalculateShippingResult {
  isCalculando: boolean;
  error: string | null;
}

/**
 * Hook que calcula automáticamente el costo de envío cuando hay código postal.
 * Se ejecuta cuando:
 * - Hay codigoPostal en el store
 * - Hay items en el carrito
 * - tipoEntrega === 'envio'
 */
export function useAutoCalculateShipping(): UseAutoCalculateShippingResult {
  const { codigoPostal, tipoEntrega, setCostoEnvio, costoEnvio } = useCheckoutStore();
  const { items } = useCartStore();
  const cotizarEnvioMutation = useCotizarEnvio();
  const ultimoCodigoPostalCalculado = useRef<string | null>(null);
  const codigoPostalAnterior = useRef<string | null>(null);
  const estaCalculandoRef = useRef(false);
  const costoEnvioRef = useRef<number | null>(null);
  const mutationRef = useRef(cotizarEnvioMutation);
  const inicializadoRef = useRef(false);

  // Actualizar refs cuando cambian
  useEffect(() => {
    costoEnvioRef.current = costoEnvio;
    mutationRef.current = cotizarEnvioMutation;
  }, [costoEnvio, cotizarEnvioMutation]);
  
  // Inicializar refs una sola vez al montar
  useEffect(() => {
    if (!inicializadoRef.current) {
      if (codigoPostal) {
        codigoPostalAnterior.current = codigoPostal;
      }
      if (codigoPostal && costoEnvio !== null) {
        ultimoCodigoPostalCalculado.current = codigoPostal;
      }
      inicializadoRef.current = true;
    }
  }, []); // Solo se ejecuta una vez al montar

  useEffect(() => {
    console.log('🔵 [useAutoCalculateShipping] useEffect ejecutado', {
      codigoPostal,
      tipoEntrega,
      itemsCount: items.length,
      costoEnvio,
      costoEnvioRef: costoEnvioRef.current,
      codigoPostalAnterior: codigoPostalAnterior.current,
      ultimoCalculado: ultimoCodigoPostalCalculado.current,
      estaCalculandoRef: estaCalculandoRef.current,
      mutationPending: cotizarEnvioMutation.isPending,
    });

    // Solo calcular si es envío
    if (tipoEntrega !== 'envio') {
      console.log('⚪ [useAutoCalculateShipping] No es envío, limpiando refs');
      if (tipoEntrega === 'retiro') {
        setCostoEnvio(0);
      }
      ultimoCodigoPostalCalculado.current = null;
      codigoPostalAnterior.current = null;
      estaCalculandoRef.current = false;
      return;
    }

    // Validar que tenemos todo lo necesario
    const tieneCodigoPostal = codigoPostal && /^[0-9]{4}$/.test(codigoPostal);
    const tieneItems = items && items.length > 0;
    const estaCalculando = mutationRef.current.isPending || estaCalculandoRef.current;
    
    // PRIMERO: Si ya hay un costo calculado en el store para este código postal, NO calcular
    // Esto previene recálculos cuando el componente se monta de nuevo
    // Usar costoEnvio directamente del store, no del ref (más confiable)
    const yaTieneCosto = costoEnvio !== null && costoEnvio !== undefined;
    const yaCalculadoEsteCP = codigoPostal === ultimoCodigoPostalCalculado.current;
    
    console.log('🔍 [useAutoCalculateShipping] Validaciones:', {
      tieneCodigoPostal,
      tieneItems,
      estaCalculando,
      codigoPostalActual: codigoPostal,
      codigoPostalAnterior: codigoPostalAnterior.current,
      yaTieneCosto,
      yaCalculadoEsteCP,
      ultimoCalculado: ultimoCodigoPostalCalculado.current,
      costoEnvio,
      costoEnvioRef: costoEnvioRef.current,
    });
    
    // Si ya hay costo calculado para este CP, NO calcular (incluso si el ref dice que cambió)
    // Inicializar refs si es la primera vez que vemos este CP con costo
    if (yaTieneCosto && codigoPostal) {
      if (ultimoCodigoPostalCalculado.current === null) {
        // Primera vez que vemos este CP con costo, inicializar refs
        ultimoCodigoPostalCalculado.current = codigoPostal;
        codigoPostalAnterior.current = codigoPostal;
        console.log('🔄 [useAutoCalculateShipping] Inicializando refs con CP y costo existente');
      } else if (yaCalculadoEsteCP) {
        // Ya calculamos este CP, NO recalcular
        console.log('✅ [useAutoCalculateShipping] Ya hay costo calculado para este CP, NO recalcular');
        codigoPostalAnterior.current = codigoPostal;
        return;
      }
    }
    
    // Detectar si el código postal cambió (SOLO calcular si cambió)
    const codigoPostalCambio = codigoPostal !== codigoPostalAnterior.current;
    
    // Si el CP NO cambió, NO hacer nada (evitar recálculos innecesarios)
    if (!codigoPostalCambio) {
      console.log('✅ [useAutoCalculateShipping] CP NO cambió, NO calcular');
      return;
    }
    
    console.log('🟡 [useAutoCalculateShipping] CP cambió, verificando si debe calcular...');
    
    // Si el CP cambió, actualizar la referencia ANTES de calcular
    codigoPostalAnterior.current = codigoPostal;

    // Solo calcular si:
    // 1. Hay código postal válido
    // 2. Hay items en el carrito
    // 3. No está calculando actualmente
    const debeCalcular = tieneCodigoPostal && tieneItems && !estaCalculando;

    console.log('🔍 [useAutoCalculateShipping] Decisión final:', {
      debeCalcular,
      tieneCodigoPostal,
      tieneItems,
      estaCalculando,
    });

    if (debeCalcular) {
      console.log('🚀 [useAutoCalculateShipping] INICIANDO CÁLCULO para CP:', codigoPostal);
      // Marcar que estamos calculando para evitar múltiples ejecuciones
      estaCalculandoRef.current = true;
      // Marcar el CP ANTES de calcular para evitar múltiples cálculos
      ultimoCodigoPostalCalculado.current = codigoPostal;

      mutationRef.current.mutate(
        {
          codigoPostal: codigoPostal,
          ciudad: undefined, // No necesario para cotización
          provincia: undefined, // No necesario para cotización
        },
        {
          onSuccess: (data) => {
            console.log('✅ [useAutoCalculateShipping] Cálculo exitoso:', data);
            setCostoEnvio(data.precio);
            // Mantener la referencia del CP calculado
            ultimoCodigoPostalCalculado.current = codigoPostal;
            estaCalculandoRef.current = false;
          },
          onError: (error: any) => {
            console.error('❌ [useAutoCalculateShipping] Error al calcular envío:', error);
            // No mostrar error, solo no calcular
            // El usuario puede continuar sin costo de envío
            setCostoEnvio(null);
            // Permitir reintentar con el mismo CP si falla
            ultimoCodigoPostalCalculado.current = null;
            estaCalculandoRef.current = false;
          },
        }
      );
    } else {
      console.log('⏸️ [useAutoCalculateShipping] NO se calcula porque:', {
        tieneCodigoPostal,
        tieneItems,
        estaCalculando,
      });
    }
  }, [
    codigoPostal,
    tipoEntrega,
    items.length,
    setCostoEnvio,
    // NO incluir costoEnvio ni cotizarEnvioMutation en dependencias para evitar recálculos
  ]);

  return {
    isCalculando: mutationRef.current.isPending,
    error: null, // No mostramos errores, solo no calculamos
  };
}
