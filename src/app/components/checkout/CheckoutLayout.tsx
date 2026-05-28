"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";
import { useCartStore } from "@/app/stores/cartStore";
import { useCheckoutStepNavigation } from "@/app/hooks/checkout/useCheckoutStepNavigation";
import EmptyCartCheckoutState from "@/app/components/cart/EmptyCartCheckoutState";
import StepIndicator from "./StepIndicator";
import Step1CartConfirmation from "./Step1CartConfirmation";
import Step2PersonalInfo from "./Step2PersonalInfo";
import Step3ShippingData from "./Step3ShippingData";
import Step3PaymentConfirmation from "./Step3PaymentConfirmation";
import CartSummary from "./CartSummary";

export default function CheckoutLayout() {
  const { currentStep, completedSteps } = useCheckoutStore();
  const cartItemsCount = useCartStore((s) => s.items.length);
  const { handleStepClick } = useCheckoutStepNavigation();

  const isCartEmpty = cartItemsCount === 0;
  const showSummaryProductList = currentStep !== 1;

  const stepContent = isCartEmpty ? (
    <EmptyCartCheckoutState />
  ) : (
    <>
      {currentStep === 1 && <Step1CartConfirmation />}
      {currentStep === 2 && <Step2PersonalInfo />}
      {currentStep === 3 && <Step3ShippingData />}
      {currentStep === 4 && <Step3PaymentConfirmation />}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <div
        className="w-full py-6"
        style={{ backgroundColor: "var(--secundario)" }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-2xl font-bold text-white">Finalizar compra</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Desktop: 3 columnas */}
        <div className="hidden lg:grid lg:grid-cols-[20%_50%_30%] gap-8">
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
                onStepClick={handleStepClick}
              />
            </div>
          </div>

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
                  key={isCartEmpty ? "empty" : currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {stepContent}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="sticky top-6 self-start">
            {!isCartEmpty && <CartSummary showProductList={showSummaryProductList} />}
          </div>
        </div>

        {/* Tablet */}
        <div className="hidden md:block lg:hidden space-y-8">
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
              onStepClick={handleStepClick}
            />
          </div>

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
                  key={isCartEmpty ? "empty" : currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {stepContent}
                </motion.div>
              </AnimatePresence>
            </div>

            <div>{!isCartEmpty && <CartSummary showProductList={showSummaryProductList} />}</div>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-6">
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
              onStepClick={handleStepClick}
            />
          </div>

          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: "var(--white)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isCartEmpty ? "empty" : currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {stepContent}
              </motion.div>
            </AnimatePresence>
          </div>

          {!isCartEmpty && (currentStep === 1 || currentStep === 4) && (
            <CartSummary showProductList={showSummaryProductList} />
          )}
        </div>
      </div>
    </div>
  );
}
