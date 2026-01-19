"use client";

import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";
import { ContactFormData } from "../schemas/contactForm.schema";
import { useAuth } from "@/app/context/AuthContext";
import { useContactForm } from "@/app/hooks/checkout/useContactForm";
import { useAutoFillUserData } from "@/app/hooks/checkout/useAutoFillUserData";
import { useBillingData } from "@/app/hooks/checkout/useBillingData";
import { useGuestCheckout } from "@/app/hooks/checkout/useGuestCheckout";
import { useContactFormOptions } from "@/app/hooks/checkout/useContactFormOptions";
import { useCotizarEnvio } from "@/app/hooks/checkout/useCotizarEnvio";
import { useCartStore } from "@/app/stores/cartStore";
import { useEffect, useRef } from "react";
import { CheckoutContactGuard } from "./CheckoutContactGuard";
import { ContactFormLayout } from "./ContactFormLayout";
import { ContactPersonalSection } from "./ContactPersonalSection";
import { ShippingAddressSection } from "./ShippingAddressSection";
import { BillingSection } from "./BillingSection";
import { ContactFormActions } from "./ContactFormActions";

export default function Step2ContactForm() {
  const { contactData, setContactData, setCurrentStep, completeStep, cartItems, setCostoEnvio, costoEnvio } = useCheckoutStore();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { items } = useCartStore();
  const cotizarEnvioMutation = useCotizarEnvio();

  // Hooks de formulario
  // Convertir contactData (PersonalFormData) a ContactFormData si existe
  // contactData del store es PersonalFormData (sin campos de dirección)
  // pero useContactForm espera ContactFormData (con campos de dirección)
  const contactFormDefaultValues: ContactFormData | null = contactData
    ? {
        ...contactData,
        address: "",
        city: "",
        state: "",
        postalCode: "",
        mismaDireccionEnvio: true,
      }
    : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    control,
  } = useContactForm({ defaultValues: contactFormDefaultValues });

  // Autocompletar datos del usuario
  useAutoFillUserData({
    isAuthenticated,
    user,
    contactData: contactFormDefaultValues,
    setValue,
  });

  // Gestión de datos de facturación
  const {
    necesitaFacturaA,
    usarMismosDatos,
    mismaDireccionEnvio,
    setNecesitaFacturaA,
    setUsarMismosDatos,
    setMismaDireccionEnvio,
  } = useBillingData({ setValue, watch });

  // Gestión de checkout como invitado
  const {
    isGuestMode,
    isProcessingGuest,
    emailExistsError,
    handleContinueAsGuest,
    handleGuestFormSubmit,
    handleLogin,
  } = useGuestCheckout({
    onSuccess: (data) => {
      setContactData(data);
      completeStep(2);
      setCurrentStep(3);
    },
  });

  // Opciones de selects
  const { provinciaOptions, tipoDocumentoOptions } = useContactFormOptions();

  // Cotizar envío automáticamente cuando se completa el código postal
  const postalCode = watch('postalCode');
  const city = watch('city');
  const state = watch('state');
  
  // Usar useRef para trackear si ya limpiamos el costo de envío para evitar bucles
  const lastClearedPostalCode = useRef<string | null>(null);

  useEffect(() => {
    // Solo cotizar si hay código postal válido, productos en el carrito y está autenticado
    if (
      postalCode && 
      postalCode.length >= 4 && 
      postalCode.match(/^\d{4,5}$/) && // Validar que sea numérico
      items.length > 0 && 
      isAuthenticated &&
      !authLoading
    ) {
      // Resetear el ref cuando hay un código postal válido
      lastClearedPostalCode.current = null;
      
      // Debounce para no cotizar en cada tecla
      const timeoutId = setTimeout(() => {
        cotizarEnvioMutation.mutate(
          {
            codigoPostal: postalCode,
            ciudad: city,
            provincia: state,
          },
          {
            onSuccess: (data: { precio: number; moneda: string }) => {
              setCostoEnvio(data.precio);
            },
            onError: (error: Error) => {
              console.error('Error al cotizar envío:', error);
              setCostoEnvio(null);
              // No mostrar toast de error, solo en consola
              // El usuario puede continuar sin costo de envío
            },
          }
        );
      }, 1000); // Esperar 1 segundo después de que el usuario deje de escribir

      return () => clearTimeout(timeoutId);
    } else {
      // Si no hay código postal válido, limpiar costo de envío solo una vez por código postal
      // Esto evita el bucle infinito de actualizaciones
      const currentPostalCode = postalCode || '';
      if ((!postalCode || postalCode.length < 4) && lastClearedPostalCode.current !== currentPostalCode) {
        lastClearedPostalCode.current = currentPostalCode;
        setCostoEnvio(null);
      }
    }
    // setCostoEnvio y cotizarEnvioMutation son estables (funciones de Zustand y React Query)
    // No necesitan estar en las dependencias
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postalCode, city, state, items.length, isAuthenticated, authLoading]);

  // Handlers
  const onSubmit = (data: ContactFormData) => {
    setContactData(data);
    completeStep(2);
    setCurrentStep(3);
  };

  const formSubmitHandler = isGuestMode 
    ? handleSubmit(handleGuestFormSubmit as any) 
    : handleSubmit(onSubmit as any);

  return (
    <CheckoutContactGuard
      authLoading={authLoading}
      isAuthenticated={isAuthenticated}
      isGuestMode={isGuestMode}
      isProcessingGuest={isProcessingGuest}
      onLogin={handleLogin}
      onContinueAsGuest={handleContinueAsGuest}
    >
      <ContactFormLayout onSubmit={formSubmitHandler}>
        <ContactPersonalSection
          register={register}
          control={control}
          watch={watch}
          errors={errors}
          setValue={setValue}
          emailExistsError={emailExistsError}
          onLogin={handleLogin}
          tipoDocumentoOptions={tipoDocumentoOptions}
        />

        <ShippingAddressSection
          register={register}
          control={control}
          errors={errors}
          provinciaOptions={provinciaOptions}
        />

        <BillingSection
          register={register}
          control={control}
          watch={watch}
          errors={errors}
          necesitaFacturaA={necesitaFacturaA}
          usarMismosDatos={usarMismosDatos}
          mismaDireccionEnvio={mismaDireccionEnvio}
          setNecesitaFacturaA={setNecesitaFacturaA}
          setUsarMismosDatos={setUsarMismosDatos}
          setMismaDireccionEnvio={setMismaDireccionEnvio}
          provinciaOptions={provinciaOptions}
        />

        <ContactFormActions
          onBack={() => setCurrentStep(1)}
          isValid={isValid}
          isProcessingGuest={isProcessingGuest}
        />
      </ContactFormLayout>
    </CheckoutContactGuard>
  );
}
