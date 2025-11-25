"use client";

import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: { number: number; label: string }[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="bg-card rounded-2xl p-8 shadow-sm">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isUpcoming = step.number > currentStep;

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1 relative">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 ${
                    isCompleted
                      ? "bg-principal text-white shadow-lg shadow-principal/30"
                      : isCurrent
                      ? "bg-principal text-white ring-4 ring-principal/20 shadow-lg shadow-principal/30 scale-110"
                      : "bg-input/50 text-foreground/40"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <span
                  className={`mt-3 text-sm font-semibold text-center ${
                    isCurrent
                      ? "text-principal"
                      : isCompleted
                      ? "text-foreground"
                      : "text-foreground/40"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-4 rounded-full transition-all duration-300 ${
                    isCompleted ? "bg-principal" : "bg-input/50"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

