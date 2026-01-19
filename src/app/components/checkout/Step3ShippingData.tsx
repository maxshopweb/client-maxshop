"use client";

import { Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import { useShippingForm } from "@/app/hooks/checkout/useShippingForm";
import { useContactFormOptions } from "@/app/hooks/checkout/useContactFormOptions";
import { useCotizarEnvioOnSubmit } from "@/app/hooks/checkout/useCotizarEnvioOnSubmit";
import ShippingLoaderOverlay from "./ShippingLoaderOverlay";
import TipoEntregaSelector from "./TipoEntregaSelector";
import CostoEnvioDisplay from "./CostoEnvioDisplay";
import { ShippingFormData } from "@/app/schemas/shippingForm.schema";
import { direccionesService } from "@/app/services/direcciones.service";

export default function Step3ShippingData() {
  const { 
    shippingData, 
    setShippingData, 
    setCurrentStep, 
    completeStep,
    costoEnvio,
    setCostoEnvio,
    setTipoEntrega,
    setIdDireccion,
    id_direccion,
  } = useCheckoutStore();
  
  const { isAuthenticated } = useAuth();
  const { cotizar, isCotizando, error: cotizacionError } = useCotizarEnvioOnSubmit();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDireccionId, setSelectedDireccionId] = useState<string | null>(id_direccion);

  // Inicializar el formulario primero para poder usar watch
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    control,
    trigger,
  } = useShippingForm();

  // Obtener tipoEntrega del formulario para usarlo en useQuery
  const tipoEntrega = watch('tipoEntrega');
  
  // Observar cambios en los campos de dirección para resetear costo
  const address = watch('address');
  const altura = watch('altura');
  const piso = watch('piso');
  const dpto = watch('dpto');
  const city = watch('city');
  const state = watch('state');
  const postalCode = watch('postalCode');

  // Ref para guardar valores previos y detectar cambios reales
  const prevDireccionRef = useRef({
    address: '',
    altura: '',
    piso: '',
    dpto: '',
    city: '',
    state: '',
    postalCode: '',
    selectedDireccionId: null as string | null,
  });

  // Cargar direcciones guardadas si el usuario está autenticado
  const { data: direcciones = [] } = useQuery({
    queryKey: ['direcciones'],
    queryFn: () => direccionesService.getAll(),
    enabled: isAuthenticated && tipoEntrega === 'envio',
  });

  // Actualizar tipoEntrega en el store cuando cambie
  useEffect(() => {
    if (tipoEntrega) {
      setTipoEntrega(tipoEntrega);
      if (tipoEntrega === 'retiro') {
        setCostoEnvio(0);
      } else if (tipoEntrega === 'envio') {
        // Si cambia a envío, resetear costo para que se recalcule
        setCostoEnvio(null);
      }
    }
  }, [tipoEntrega, setTipoEntrega, setCostoEnvio]);

  // Resetear costo de envío cuando cambien los campos de dirección
  useEffect(() => {
    if (tipoEntrega !== 'envio' || costoEnvio === null) {
      // Actualizar refs pero no resetear si no es envío o no hay costo calculado
      prevDireccionRef.current = {
        address: address || '',
        altura: altura || '',
        piso: piso || '',
        dpto: dpto || '',
        city: city || '',
        state: state || '',
        postalCode: postalCode || '',
        selectedDireccionId: selectedDireccionId,
      };
      return;
    }

    // Verificar si algún campo de dirección cambió
    const hasChanged = 
      prevDireccionRef.current.address !== (address || '') ||
      prevDireccionRef.current.altura !== (altura || '') ||
      prevDireccionRef.current.piso !== (piso || '') ||
      prevDireccionRef.current.dpto !== (dpto || '') ||
      prevDireccionRef.current.city !== (city || '') ||
      prevDireccionRef.current.state !== (state || '') ||
      prevDireccionRef.current.postalCode !== (postalCode || '') ||
      prevDireccionRef.current.selectedDireccionId !== selectedDireccionId;

    if (hasChanged) {
      // Si hay un costo calculado y cambió algún campo de dirección, resetear
      setCostoEnvio(null);
      // Actualizar los valores previos
      prevDireccionRef.current = {
        address: address || '',
        altura: altura || '',
        piso: piso || '',
        dpto: dpto || '',
        city: city || '',
        state: state || '',
        postalCode: postalCode || '',
        selectedDireccionId: selectedDireccionId,
      };
    }
  }, [address, altura, piso, dpto, city, state, postalCode, selectedDireccionId, tipoEntrega, costoEnvio, setCostoEnvio]);

  // Opciones de selects
  const { provinciaOptions } = useContactFormOptions();

  const onSubmit = async (data: ShippingFormData) => {
    setIsSubmitting(true);
    
    try {
      // Si es envío, cotizar antes de continuar
      if (data.tipoEntrega === 'envio') {
        const costo = await cotizar(data);
        if (costo === null) {
          // Si falla la cotización, NO continuar
          console.error('❌ [Checkout] No se pudo cotizar envío. Por favor, verifica los datos de dirección.');
          setIsSubmitting(false);
          return; // No continuar si falla
        }
      } else {
        // Si es retiro, costo es 0
        setCostoEnvio(0);
      }

      setShippingData(data);
      completeStep(3);
      setCurrentStep(4);
    } catch (error) {
      console.error('Error al procesar formulario de envío:', error);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Loader Overlay - Mostrar solo cuando se está calculando Y no hay costo calculado */}
      <ShippingLoaderOverlay 
        isVisible={(isCotizando || isSubmitting) && costoEnvio === null && tipoEntrega === 'envio'}
        message="Calculando costo de envío a tu dirección..."
      />

      {/* Error de cotización */}
      {cotizacionError && tipoEntrega === 'envio' && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{cotizacionError}</p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setCurrentStep(2)}
            className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-foreground/90">Datos de envío</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          {/* Selector de Tipo de Entrega */}
          <TipoEntregaSelector
            selectedTipo={tipoEntrega}
            costoEnvio={costoEnvio}
            onSelect={(tipo) => setValue('tipoEntrega', tipo, { shouldValidate: true })}
            error={errors.tipoEntrega?.message}
          />

          {/* Campos de dirección - Solo si es envío */}
          {tipoEntrega === 'envio' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t"
            >
              <h3 className="text-lg font-semibold text-foreground/90">Dirección de envío</h3>
              
              {/* Selector de direcciones guardadas (solo si está autenticado y tiene direcciones) */}
              {isAuthenticated && direcciones.length > 0 && (
                <div className="mb-4 p-4 bg-principal/5 rounded-lg border border-principal/20">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Seleccionar dirección guardada
                  </label>
                  <Select
                    options={[
                      { value: '', label: 'Usar dirección nueva' },
                      ...direcciones.map(d => ({
                        value: d.id_direccion,
                        label: `${d.nombre || 'Sin nombre'} - ${d.direccion} ${d.altura}${d.es_principal ? ' (Principal)' : ''}`,
                      })),
                    ]}
                    value={selectedDireccionId || ''}
                    onChange={async (value) => {
                      // Convertir a string ya que id_direccion es string
                      const newId = value ? String(value) : null;
                      setSelectedDireccionId(newId);
                      setIdDireccion(newId);
                      if (value) {
                        const dir = direcciones.find(d => d.id_direccion === String(value));
                        if (dir) {
                          // Llenar todos los campos con shouldValidate y shouldDirty
                          setValue('address', dir.direccion || '', { shouldValidate: true, shouldDirty: true });
                          setValue('altura', dir.altura || '', { shouldValidate: true, shouldDirty: true });
                          setValue('piso', dir.piso || '', { shouldValidate: true, shouldDirty: true });
                          setValue('dpto', dir.dpto || '', { shouldValidate: true, shouldDirty: true });
                          setValue('city', dir.ciudad || '', { shouldValidate: true, shouldDirty: true });
                          setValue('state', dir.provincia || '', { shouldValidate: true, shouldDirty: true });
                          setValue('postalCode', dir.cod_postal?.toString() || '', { shouldValidate: true, shouldDirty: true });
                          // Disparar validación completa después de llenar todos los campos
                          await trigger();
                        }
                      } else {
                        // Limpiar campos si se selecciona "Usar dirección nueva"
                        setValue('address', '', { shouldValidate: true, shouldDirty: true });
                        setValue('altura', '', { shouldValidate: true, shouldDirty: true });
                        setValue('piso', '', { shouldValidate: true, shouldDirty: true });
                        setValue('dpto', '', { shouldValidate: true, shouldDirty: true });
                        setValue('city', '', { shouldValidate: true, shouldDirty: true });
                        setValue('state', '', { shouldValidate: true, shouldDirty: true });
                        setValue('postalCode', '', { shouldValidate: true, shouldDirty: true });
                        // Disparar validación después de limpiar
                        await trigger();
                      }
                    }}
                    placeholder="Seleccionar dirección"
                  />
                  <p className="text-xs text-foreground/50 mt-2">
                    O completa los campos a continuación para usar una dirección nueva
                  </p>
                </div>
              )}
              
              <Input
                label="Calle *"
                {...register("address")}
                error={errors.address?.message}
                placeholder="Nombre de la calle"
                className="rounded-lg"
                style={{
                  backgroundColor: "var(--white)",
                  border: errors.address
                    ? "1px solid rgb(239, 68, 68)"
                    : "1px solid rgba(23, 28, 53, 0.1)",
                }}
              />

              <div className="grid grid-cols-3 gap-4 items-end">
                <Input
                  label="Altura *"
                  {...register("altura")}
                  error={errors.altura?.message}
                  placeholder="123"
                  className="rounded-lg"
                  style={{
                    backgroundColor: "var(--white)",
                    border: errors.altura
                      ? "1px solid rgb(239, 68, 68)"
                      : "1px solid rgba(23, 28, 53, 0.1)",
                  }}
                />

                <Input
                  label="Piso (opcional)"
                  {...register("piso")}
                  error={errors.piso?.message}
                  placeholder="1"
                  className="rounded-lg"
                  style={{
                    backgroundColor: "var(--white)",
                    border: errors.piso
                      ? "1px solid rgb(239, 68, 68)"
                      : "1px solid rgba(23, 28, 53, 0.1)",
                  }}
                />

                <Input
                  label="Dpto (opcional)"
                  {...register("dpto")}
                  error={errors.dpto?.message}
                  placeholder="A"
                  className="rounded-lg"
                  style={{
                    backgroundColor: "var(--white)",
                    border: errors.dpto
                      ? "1px solid rgb(239, 68, 68)"
                      : "1px solid rgba(23, 28, 53, 0.1)",
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Ciudad *"
                  {...register("city")}
                  error={errors.city?.message}
                  placeholder="Ciudad"
                  className="rounded-lg"
                  style={{
                    backgroundColor: "var(--white)",
                    border: errors.city
                      ? "1px solid rgb(239, 68, 68)"
                      : "1px solid rgba(23, 28, 53, 0.1)",
                  }}
                />

                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Provincia *"
                      options={provinciaOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Seleccionar provincia"
                      error={errors.state?.message}
                    />
                  )}
                />
              </div>

              <Input
                label="Código Postal *"
                {...register("postalCode")}
                error={errors.postalCode?.message}
                placeholder="5000"
                className="rounded-lg"
                style={{
                  backgroundColor: "var(--white)",
                  border: errors.postalCode
                    ? "1px solid rgb(239, 68, 68)"
                    : "1px solid rgba(23, 28, 53, 0.1)",
                }}
              />

              {/* Mostrar costo cuando esté calculado */}
              <CostoEnvioDisplay 
                costoEnvio={costoEnvio} 
                isLoading={isCotizando}
              />
            </motion.div>
          )}

          {/* Mensaje para retiro en tienda */}
          {tipoEntrega === 'retiro' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-principal/10 border border-principal/20"
            >
              <p className="text-sm text-foreground/70">
                Retirarás tu pedido en nuestro local sin costo adicional.
              </p>
              <p className="text-xs text-foreground/50 mt-1">
                Te contactaremos cuando tu pedido esté listo para retirar.
              </p>
            </motion.div>
          )}

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline-primary"
              size="lg"
              onClick={() => setCurrentStep(2)}
              className="rounded-lg flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!isValid || isCotizando || isSubmitting}
              className="rounded-lg flex-1"
            >
              {(isCotizando || isSubmitting) && tipoEntrega === 'envio' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Calculando...</span>
                </>
              ) : (
                'Continuar'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </>
  );
}
