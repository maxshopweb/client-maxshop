"use client";

import { useEffect, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/app/stores/cartStore";
import { IDatosEnvio } from "@/app/types/cart.type";
import { cartFormsConfig } from "@/app/config/cartForms.config";
import { datosEnvioSchema, type DatosEnvioFormData } from "@/app/schemas/envio.schema";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import CartSummary from "../CartSummary";
import { MapPin, Package } from "lucide-react";

export interface Step2ShippingDataRef {
  validate: () => Promise<boolean>;
}

const Step2ShippingData = forwardRef<Step2ShippingDataRef>((props, ref) => {
  const { checkoutState, setDatosEnvio } = useCartStore();
  
  const form = useForm<DatosEnvioFormData>({
    resolver: zodResolver(datosEnvioSchema),
    mode: 'onChange',
    defaultValues: checkoutState.datosEnvio || { tipo: 'envio' },
    shouldFocusError: true,
  });

  const { watch, formState: { errors } } = form;
  const tipoEnvio = watch('tipo');

  // Exponer función de validación al componente padre
  useImperativeHandle(ref, () => ({
    validate: async () => {
      const isValid = await form.trigger();
      if (isValid) {
        const formData = form.getValues();
        setDatosEnvio(formData as IDatosEnvio);
      }
      return isValid;
    },
  }));

  // Guardar datos cuando cambian
  useEffect(() => {
    const subscription = watch((data) => {
      if (data.tipo) {
        setDatosEnvio(data as IDatosEnvio);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setDatosEnvio]);

  // Filtrar campos según el tipo de envío
  const getVisibleFields = () => {
    if (tipoEnvio === 'retiro') {
      return cartFormsConfig.envio.filter(
        (field) =>
          field.name === 'tipo' ||
          field.name === 'sucursal' ||
          field.name === 'fecha_retiro' ||
          field.name === 'horario_retiro'
      );
    }
    return cartFormsConfig.envio.filter(
      (field) =>
        field.name !== 'sucursal' &&
        field.name !== 'fecha_retiro' &&
        field.name !== 'horario_retiro'
    );
  };

  const visibleFields = getVisibleFields();
  const tipoField = visibleFields.find(f => f.name === 'tipo');
  const otherFields = visibleFields.filter(f => f.name !== 'tipo');
  
  // Dividir campos en dos columnas (excepto tipo que va arriba)
  const leftColumn = otherFields.filter((_, index) => index % 2 === 0);
  const rightColumn = otherFields.filter((_, index) => index % 2 === 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Formulario */}
      <div className="lg:col-span-2">
        <div className="bg-principal/5 rounded-xl p-8 space-y-6 shadow-sm border border-principal/10">
          {/* Header con icono */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-principal/20">
            {tipoEnvio === 'envio' ? (
              <MapPin className="w-6 h-6 text-principal" />
            ) : (
              <Package className="w-6 h-6 text-principal" />
            )}
            <h3 className="text-xl font-semibold text-foreground">
              {tipoEnvio === 'envio' ? 'Datos de envío' : 'Datos de retiro'}
            </h3>
          </div>

          {/* Campo tipo arriba */}
          {tipoField && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">
                {tipoField.label}
                {tipoField.required && <span className="text-principal ml-1">*</span>}
              </label>
              <Select
                options={tipoField.options || []}
                value={form.watch('tipo') as string || ''}
                onChange={(value) => form.setValue('tipo', value as any)}
                className="bg-background rounded-lg text-sm text-foreground border-2 border-input/70 focus:border-principal transition-colors shadow-sm"
              />
              {errors.tipo && (
                <p className="text-sm text-destructive mt-1">{errors.tipo.message}</p>
              )}
            </div>
          )}

          {/* Campos en dos columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Columna izquierda */}
            <div className="space-y-5">
              {leftColumn.map((field) => {
                const fieldName = field.name as keyof DatosEnvioFormData;
                const error = errors[fieldName];
                
                if (field.type === 'select') {
                  return (
                    <div key={field.name} className="space-y-2">
                      <label className="block text-sm font-semibold text-foreground">
                        {field.label}
                        {field.required && <span className="text-principal ml-1">*</span>}
                      </label>
                      <Select
                        options={field.options || []}
                        value={form.watch(fieldName) as string || ''}
                        onChange={(value) => form.setValue(fieldName, value as any)}
                        className="bg-background rounded-lg text-sm text-foreground border-2 border-input/70 focus:border-principal transition-colors shadow-sm"
                      />
                      {error && (
                        <p className="text-sm text-destructive mt-1">{error.message}</p>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={field.name} className="space-y-2">
                    <label className="block text-sm font-semibold text-foreground">
                      {field.label}
                      {field.required && <span className="text-principal ml-1">*</span>}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      {...form.register(fieldName)}
                      className="w-full px-4 py-3 bg-background rounded-lg text-sm text-foreground placeholder:text-foreground/40 border-2 border-input/70 focus:border-principal focus:ring-2 focus:ring-principal/20 focus:outline-none transition-all shadow-sm"
                    />
                    {error && (
                      <p className="text-sm text-destructive mt-1">{error.message}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Columna derecha */}
            <div className="space-y-5">
              {rightColumn.map((field) => {
                const fieldName = field.name as keyof DatosEnvioFormData;
                const error = errors[fieldName];
                
                if (field.type === 'select') {
                  return (
                    <div key={field.name} className="space-y-2">
                      <label className="block text-sm font-semibold text-foreground">
                        {field.label}
                        {field.required && <span className="text-principal ml-1">*</span>}
                      </label>
                      <Select
                        options={field.options || []}
                        value={form.watch(fieldName) as string || ''}
                        onChange={(value) => form.setValue(fieldName, value as any)}
                        className="bg-background rounded-lg text-sm text-foreground border-2 border-input/70 focus:border-principal transition-colors shadow-sm"
                      />
                      {error && (
                        <p className="text-sm text-destructive mt-1">{error.message}</p>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={field.name} className="space-y-2">
                    <label className="block text-sm font-semibold text-foreground">
                      {field.label}
                      {field.required && <span className="text-principal ml-1">*</span>}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      {...form.register(fieldName)}
                      className="w-full px-4 py-3 bg-background rounded-lg text-sm text-foreground placeholder:text-foreground/40 border-2 border-input/70 focus:border-principal focus:ring-2 focus:ring-principal/20 focus:outline-none transition-all shadow-sm"
                    />
                    {error && (
                      <p className="text-sm text-destructive mt-1">{error.message}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="lg:col-span-1">
        <CartSummary />
      </div>
    </div>
  );
});

Step2ShippingData.displayName = 'Step2ShippingData';

export default Step2ShippingData;

