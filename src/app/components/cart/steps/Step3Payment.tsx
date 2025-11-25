"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/app/stores/cartStore";
import { IDatosPago } from "@/app/types/cart.type";
import { cartFormsConfig } from "@/app/config/cartForms.config";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import CartSummary from "../CartSummary";
import { CreditCard, Wallet, Banknote, Smartphone } from "lucide-react";

const paymentIcons = {
  efectivo: Banknote,
  transferencia: Smartphone,
  credito: CreditCard,
  debito: CreditCard,
};

export default function Step3Payment() {
  const { checkoutState, setDatosPago } = useCartStore();
  const [formData, setFormData] = useState<Partial<IDatosPago>>(
    checkoutState.datosPago || { metodo: 'efectivo' }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Guardar datos cuando cambian
    if (formData.metodo) {
      const datos: IDatosPago = {
        metodo: formData.metodo as 'efectivo' | 'transferencia' | 'credito' | 'debito',
        ...(formData.metodo === 'transferencia' && {
          comprobante: formData.comprobante,
        }),
        ...((formData.metodo === 'credito' || formData.metodo === 'debito') && {
          tarjeta: {
            numero: formData.tarjeta?.numero,
            nombre: formData.tarjeta?.nombre,
            vencimiento: formData.tarjeta?.vencimiento,
            cvv: formData.tarjeta?.cvv,
          },
        }),
      };
      setDatosPago(datos);
    }
  }, [formData, setDatosPago]);

  const handleChange = (name: string, value: string | File | null) => {
    if (name.startsWith('tarjeta_')) {
      const tarjetaField = name.replace('tarjeta_', '');
      setFormData((prev) => ({
        ...prev,
        tarjeta: {
          ...prev.tarjeta,
          [tarjetaField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Filtrar campos según el método de pago
  const getVisibleFields = () => {
    if (formData.metodo === 'efectivo') {
      return cartFormsConfig.pago.filter((field) => field.name === 'metodo');
    }
    if (formData.metodo === 'transferencia') {
      return cartFormsConfig.pago.filter(
        (field) => field.name === 'metodo' || field.name === 'comprobante'
      );
    }
    // Para crédito/débito, mostrar todos los campos de tarjeta
    return cartFormsConfig.pago.filter(
      (field) =>
        field.name === 'metodo' ||
        field.name === 'numero_tarjeta' ||
        field.name === 'nombre_tarjeta' ||
        field.name === 'vencimiento' ||
        field.name === 'cvv'
    );
  };

  const PaymentIcon = formData.metodo ? paymentIcons[formData.metodo] : Wallet;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Formulario */}
      <div className="lg:col-span-2">
        <div className="bg-card rounded-xl p-8 space-y-6 shadow-sm">
          {/* Header con icono */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-input/30">
            <PaymentIcon className="w-6 h-6 text-principal" />
            <h3 className="text-xl font-semibold text-foreground">
              Método de pago
            </h3>
          </div>

          <div className="space-y-5">
            {getVisibleFields().map((field) => {
              if (field.type === 'select') {
                return (
                  <div key={field.name} className="space-y-2">
                    <label className="block text-sm font-semibold text-foreground">
                      {field.label}
                      {field.required && <span className="text-principal ml-1">*</span>}
                    </label>
                    <Select
                      options={field.options || []}
                      value={formData[field.name as keyof IDatosPago] as string || ''}
                      onChange={(value) => handleChange(field.name, value as string)}
                      className="bg-input/50 rounded-lg text-sm text-foreground border border-input/50 focus:border-principal/50 transition-colors"
                    />
                    {errors[field.name] && (
                      <p className="text-sm text-destructive mt-1">{errors[field.name]}</p>
                    )}
                  </div>
                );
              }

              if (field.type === 'file') {
                return (
                  <div key={field.name} className="space-y-2">
                    <label className="block text-sm font-semibold text-foreground">
                      {field.label}
                      {field.required && <span className="text-principal ml-1">*</span>}
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleChange(field.name, file);
                      }}
                      className="w-full px-4 py-3 bg-input/50 rounded-lg text-sm text-foreground border border-input/50 focus:border-principal/50 focus:ring-2 focus:ring-principal/20 focus:outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-principal file:text-white hover:file:bg-principal/90"
                    />
                    {formData.comprobante && (
                      <p className="text-sm text-foreground/60 mt-2">
                        Archivo seleccionado: {formData.comprobante instanceof File ? formData.comprobante.name : 'N/A'}
                      </p>
                    )}
                  </div>
                );
              }

              // Campos de tarjeta
              const isTarjetaField = field.name.startsWith('numero_') || 
                                     field.name.startsWith('nombre_') || 
                                     field.name === 'vencimiento' || 
                                     field.name === 'cvv';
              
              const fieldName = isTarjetaField ? `tarjeta_${field.name.replace('_tarjeta', '')}` : field.name;
              const fieldValue = isTarjetaField 
                ? formData.tarjeta?.[field.name.replace('_tarjeta', '') as keyof typeof formData.tarjeta] || ''
                : (formData[field.name as keyof IDatosPago] as string) || '';

              return (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    {field.label}
                    {field.required && <span className="text-principal ml-1">*</span>}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={fieldValue}
                    onChange={(e) => handleChange(fieldName, e.target.value)}
                    className="w-full px-4 py-3 bg-input/50 rounded-lg text-sm text-foreground placeholder:text-foreground/40 border border-input/50 focus:border-principal/50 focus:ring-2 focus:ring-principal/20 focus:outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--input)',
                    }}
                    maxLength={field.name === 'cvv' ? 4 : field.name === 'vencimiento' ? 5 : undefined}
                  />
                  {errors[field.name] && (
                    <p className="text-sm text-destructive mt-1">{errors[field.name]}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Nota para pasarela de pago */}
          {(formData.metodo === 'credito' || formData.metodo === 'debito') && (
            <div className="mt-4 p-4 bg-principal/10 rounded-lg">
              <p className="text-sm text-foreground/80">
                <strong>Nota:</strong> La integración con la pasarela de pago se implementará próximamente. 
                Por ahora, este formulario es solo una vista previa.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Resumen */}
      <div className="lg:col-span-1">
        <CartSummary />
      </div>
    </div>
  );
}

