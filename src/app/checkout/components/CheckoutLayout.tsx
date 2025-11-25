"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCheckoutStore } from "../hooks/useCheckoutStore";
import StepIndicator from "./StepIndicator";
import Step1CartConfirmation from "./Step1CartConfirmation";
import Step2ContactForm from "./Step2ContactForm";
import Step3PaymentConfirmation from "./Step3PaymentConfirmation";
import CartSummary from "./CartSummary";

export default function CheckoutLayout() {
  const { currentStep, completedSteps, setCurrentStep } = useCheckoutStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div
        className="w-full py-6"
        style={{ backgroundColor: "var(--secundario)" }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-2xl font-bold text-white">Finalizar Compra</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Desktop: 3 columnas */}
        <div className="hidden lg:grid lg:grid-cols-[20%_50%_30%] gap-8">
          {/* Columna Izquierda: Steps */}
          <div className="sticky top-6 self-start">
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: "var(--white)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <StepIndicator 
                currentStep={currentStep} 
                completedSteps={completedSteps}
                onStepClick={setCurrentStep}
              />
            </div>
          </div>

          {/* Columna Centro: Contenido */}
          <div className="min-h-[600px]">
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: "var(--white)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 1 && <Step1CartConfirmation />}
                  {currentStep === 2 && <Step2ContactForm />}
                  {currentStep === 3 && <Step3PaymentConfirmation />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Columna Derecha: Summary */}
          <div className="sticky top-6 self-start">
            <CartSummary />
          </div>
        </div>

        {/* Tablet: Steps horizontal arriba, 2 columnas abajo */}
        <div className="hidden md:block lg:hidden space-y-8">
          {/* Steps horizontal */}
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: "var(--white)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />
          </div>

          {/* Contenido y Summary en 2 columnas */}
          <div className="grid md:grid-cols-[60%_40%] gap-6">
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: "var(--white)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 1 && <Step1CartConfirmation />}
                  {currentStep === 2 && <Step2ContactForm />}
                  {currentStep === 3 && <Step3PaymentConfirmation />}
                </motion.div>
              </AnimatePresence>
            </div>

            <div>
              <CartSummary />
            </div>
          </div>
        </div>

        {/* Mobile: Stack vertical */}
        <div className="md:hidden space-y-6">
          {/* Steps */}
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: "var(--white)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />
          </div>

          {/* Summary primero en mobile */}
          <CartSummary />

          {/* Contenido */}
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: "var(--white)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && <Step1CartConfirmation />}
                {currentStep === 2 && <Step2ContactForm />}
                {currentStep === 3 && <Step3PaymentConfirmation />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

