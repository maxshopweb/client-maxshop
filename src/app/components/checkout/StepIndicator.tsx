"use client";

import { motion } from "framer-motion";
import { Check, ShoppingCart, User, Truck, CreditCard } from "lucide-react";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
  completedSteps: number[];
  onStepClick?: (step: 1 | 2 | 3 | 4) => void;
}

const steps = [
  { number: 1, label: "Confirmar Carrito", icon: ShoppingCart },
  { number: 2, label: "Información Personal", icon: User },
  { number: 3, label: "Datos de Envío", icon: Truck },
  { number: 4, label: "Método de Pago", icon: CreditCard },
] as const;

export default function StepIndicator({ currentStep, completedSteps, onStepClick }: StepIndicatorProps) {
  return (
    <>
      {/* Desktop: Vertical */}
      <div className="hidden lg:block space-y-0">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = completedSteps.includes(step.number);
          const Icon = step.icon;

          return (
            <div key={step.number}>
              {/* Step Item */}
              <div className="flex items-start gap-4 py-4">
              {/* Circle Indicator */}
              <div className="flex-shrink-0 relative z-10">
                <motion.button
                  onClick={() => onStepClick && onStepClick(step.number as 1 | 2 | 3 | 4)}
                  disabled={!onStepClick || (!isCompleted && !isActive)}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isActive
                      ? 'var(--principal)'
                      : isCompleted
                      ? 'var(--principal)'
                      : 'rgba(23, 28, 53, 0.1)',
                    color: isActive || isCompleted ? 'white' : 'rgba(23, 28, 53, 0.4)',
                  }}
                  transition={{ duration: 0.3 }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-semibold text-sm
                    ${isActive ? 'shadow-lg shadow-principal/30' : ''}
                    ${onStepClick && (isCompleted || isActive) ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                  `}
                  whileHover={onStepClick && (isCompleted || isActive) ? { scale: 1.15 } : {}}
                  whileTap={onStepClick && (isCompleted || isActive) ? { scale: 0.95 } : {}}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </motion.button>
              </div>

                {/* Label */}
                <div className="flex-1 pt-2">
                  <motion.p
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : isCompleted ? 0.7 : 0.4,
                      fontWeight: isActive ? 600 : 400,
                    }}
                    transition={{ duration: 0.2 }}
                    className={`
                      text-sm
                      ${isActive ? 'text-foreground' : isCompleted ? 'text-foreground/70' : 'text-foreground/40'}
                    `}
                  >
                    {step.label}
                  </motion.p>
                </div>
              </div>

              {/* Dashed Line Separator */}
              {index < steps.length - 1 && (
                <div
                  className="ml-5 border-t-2 border-dashed"
                  style={{ borderColor: 'rgba(23, 28, 53, 0.1)' }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Tablet/Mobile: Horizontal */}
      <div className="lg:hidden flex items-center justify-between gap-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = completedSteps.includes(step.number);
          const Icon = step.icon;

          return (
            <div key={step.number} className="flex items-center gap-2 flex-1">
              {/* Circle Indicator */}
              <div className="flex-shrink-0 relative z-10">
                <motion.button
                  onClick={() => onStepClick && onStepClick(step.number as 1 | 2 | 3 | 4)}
                  disabled={!onStepClick || (!isCompleted && !isActive)}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isActive
                      ? 'var(--principal)'
                      : isCompleted
                      ? 'var(--principal)'
                      : 'rgba(23, 28, 53, 0.1)',
                    color: isActive || isCompleted ? 'white' : 'rgba(23, 28, 53, 0.4)',
                  }}
                  transition={{ duration: 0.3 }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-semibold text-sm
                    ${isActive ? 'shadow-lg shadow-principal/30' : ''}
                    ${onStepClick && (isCompleted || isActive) ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                  `}
                  whileHover={onStepClick && (isCompleted || isActive) ? { scale: 1.15 } : {}}
                  whileTap={onStepClick && (isCompleted || isActive) ? { scale: 0.95 } : {}}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </motion.button>
              </div>

              {/* Label - Solo en tablet */}
              <div className="hidden md:block flex-1">
                <motion.p
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : isCompleted ? 0.7 : 0.4,
                    fontWeight: isActive ? 600 : 400,
                  }}
                  transition={{ duration: 0.2 }}
                  className={`
                    text-xs
                    ${isActive ? 'text-foreground' : isCompleted ? 'text-foreground/70' : 'text-foreground/40'}
                  `}
                >
                  {step.label}
                </motion.p>
              </div>

              {/* Dashed Line Separator */}
              {index < steps.length - 1 && (
                <div
                  className="hidden md:block flex-1 border-t-2 border-dashed mx-2"
                  style={{ borderColor: 'rgba(23, 28, 53, 0.1)' }}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
