"use client";

import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";
import { usePaymentForm } from "@/app/hooks/checkout/usePaymentForm";
import { useLocalPaymentHandler } from "@/app/hooks/checkout/useLocalPaymentHandler";
import { IDatosPago } from "@/app/types/cart.type";
import { Button } from "@/app/components/ui/Button";
import CartSummary from "../CartSummary";
import { PaymentHeader } from "./PaymentHeader";
import { MercadoPagoButton } from "./MercadoPagoButton";
import { PaymentSeparator } from "./PaymentSeparator";
import { PaymentMethodForm } from "./PaymentMethodForm";
import { TransferProofField } from "./TransferProofField";
import { CardFields } from "./CardFields";
import { PaymentGatewayNote } from "./PaymentGatewayNote";
import { LocalPaymentActions } from "./LocalPaymentActions";
import { ArrowLeft } from "lucide-react";

export default function Step3Payment() {
  const { setCurrentStep } = useCheckoutStore();
  const { formData, errors, handleChange, getVisibleFields } = usePaymentForm();
  const { handleConfirmLocalPayment, handleMercadoPago, isCreating } = useLocalPaymentHandler({ formData });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Formulario */}
      <div className="lg:col-span-2">
        <div className="bg-card rounded-xl p-8 space-y-6 shadow-sm">
          {/* Header con icono */}
          <PaymentHeader 
            metodo={formData.metodo} 
            onBack={() => setCurrentStep(3)} 
          />

          {/* Botón de Mercado Pago */}
          <MercadoPagoButton 
            onClick={handleMercadoPago} 
            disabled={isCreating} 
          />

          {/* Separador */}
          <PaymentSeparator />

          <div className="space-y-5">
            {getVisibleFields().map((field) => {
              if (field.type === 'select') {
                return (
                  <PaymentMethodForm
                    key={field.name}
                    field={field}
                    value={formData[field.name as keyof IDatosPago] as string || ''}
                    onChange={(value) => handleChange(field.name, value as string)}
                    error={errors[field.name]}
                  />
                );
              }

              if (field.type === 'file') {
                return (
                  <TransferProofField
                    key={field.name}
                    field={field}
                    formData={formData}
                    onChange={(name, value) => handleChange(name, value)}
                    error={errors[field.name]}
                  />
                );
              }

              return (
                <CardFields
                  key={field.name}
                  field={field}
                  formData={formData}
                  onChange={(name, value) => handleChange(name, value)}
                  error={errors[field.name]}
                />
              );
            })}
          </div>

          {/* Nota para pasarela de pago */}
          <PaymentGatewayNote metodo={formData.metodo} />

          {/* Botones de confirmación para efectivo y transferencia */}
          <LocalPaymentActions
            metodo={formData.metodo}
            isCreating={isCreating}
            onConfirm={handleConfirmLocalPayment}
          />

          {/* Botón Volver - Siempre visible */}
          <div className="pt-4 flex gap-4">
            <Button
              type="button"
              variant="outline-primary"
              size="lg"
              onClick={() => setCurrentStep(3)}
              className="rounded-lg flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="lg:col-span-1">
        <CartSummary />
      </div>
    </div>
  );
}
