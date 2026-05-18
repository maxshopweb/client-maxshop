"use client";

import * as Slider from "@radix-ui/react-slider";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  formatPriceFilterLabel,
  getPricePlaceholderExamples,
  getPriceSliderStep,
  snapPriceToStep,
} from "@/app/utils/price-filter.utils";

interface PriceSliderProps {
  min?: number;
  max?: number;
  catalogMin: number;
  catalogMax: number;
  value?: [number, number];
  maxFilterActive?: boolean;
  onValueChange?: (value: [number, number]) => void;
  disabled?: boolean;
}

export default function PriceSlider({
  min = 0,
  max = 100000,
  catalogMin,
  catalogMax,
  value: controlledValue,
  maxFilterActive = false,
  onValueChange,
  disabled = false,
}: PriceSliderProps) {
  const step = getPriceSliderStep(catalogMax);
  const placeholders = useMemo(
    () => getPricePlaceholderExamples(catalogMin, catalogMax),
    [catalogMin, catalogMax]
  );
  const [localValue, setLocalValue] = useState<[number, number]>(
    controlledValue || [min, max]
  );

  useEffect(() => {
    if (controlledValue) {
      setLocalValue(controlledValue);
    }
  }, [controlledValue?.[0], controlledValue?.[1], max, catalogMin, catalogMax, maxFilterActive]);

  const emitChange = useCallback(
    (range: [number, number]) => {
      setLocalValue(range);
      onValueChange?.(range);
    },
    [onValueChange]
  );

  const handleSliderChange = (newValue: number[]) => {
    const low = snapPriceToStep(newValue[0], step);
    let high = snapPriceToStep(newValue[1], step);
    high = Math.max(low, Math.min(high, max));
    emitChange([low, high]);
  };

  const handleMinChange = (raw: string) => {
    if (raw === "") {
      emitChange([0, localValue[1]]);
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0) return;
    const low = snapPriceToStep(Math.min(n, localValue[1]), step);
    emitChange([low, Math.max(low, localValue[1])]);
  };

  const handleMaxChange = (raw: string) => {
    if (raw === "") {
      emitChange([localValue[0], catalogMax]);
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0) return;
    const high = snapPriceToStep(Math.min(max, Math.max(n, localValue[0])), step);
    emitChange([localValue[0], high]);
  };

  const minInputValue = localValue[0] > 0 ? localValue[0] : "";
  const maxInputValue = maxFilterActive ? localValue[1] : "";

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[11px] text-foreground/50 px-0.5">
        <span>Mín. {formatPriceFilterLabel(catalogMin)}</span>
        <span>Máx. {formatPriceFilterLabel(catalogMax)}</span>
      </div>

      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[localValue[0], localValue[1]]}
        onValueChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      >
        <Slider.Track className="bg-input relative flex-1 rounded-full h-2">
          <Slider.Range className="absolute bg-principal rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-5 h-5 bg-principal rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-principal/20 cursor-pointer hover:scale-110 transition-transform" />
        <Slider.Thumb className="block w-5 h-5 bg-principal rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-principal/20 cursor-pointer hover:scale-110 transition-transform" />
      </Slider.Root>

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <label className="text-xs text-foreground/60 mb-1 block">Desde</label>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={minInputValue}
            placeholder={placeholders.min}
            onChange={(e) => handleMinChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-principal/20 focus:border-principal"
            disabled={disabled}
            min={0}
            max={localValue[1]}
            step={step}
          />
        </div>
        <div className="flex-1 min-w-0">
          <label className="text-xs text-foreground/60 mb-1 block">Hasta</label>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={maxInputValue}
            placeholder={placeholders.max}
            onChange={(e) => handleMaxChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-principal/20 focus:border-principal"
            disabled={disabled}
            min={localValue[0]}
            max={max}
            step={step}
          />
        </div>
      </div>
    </div>
  );
}
