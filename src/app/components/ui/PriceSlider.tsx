"use client";

import * as Slider from "@radix-ui/react-slider";
import { useState, useEffect } from "react";

interface PriceSliderProps {
  min?: number;
  max?: number;
  value?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  disabled?: boolean;
}

export default function PriceSlider({
  min = 0,
  max = 100000,
  value: controlledValue,
  onValueChange,
  disabled = false,
}: PriceSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(
    controlledValue || [min, max]
  );

  useEffect(() => {
    if (controlledValue) {
      setLocalValue(controlledValue);
    }
  }, [controlledValue]);

  const handleValueChange = (newValue: number[]) => {
    const range: [number, number] = [newValue[0], newValue[1]];
    setLocalValue(range);
    onValueChange?.(range);
  };

  return (
    <div className="space-y-4">
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[localValue[0], localValue[1]]}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        step={100}
        disabled={disabled}
      >
        <Slider.Track className="bg-input relative flex-1 rounded-full h-2">
          <Slider.Range className="absolute bg-principal rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-5 h-5 bg-principal rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-principal/20 cursor-pointer hover:scale-110 transition-transform" />
        <Slider.Thumb className="block w-5 h-5 bg-principal rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-principal/20 cursor-pointer hover:scale-110 transition-transform" />
      </Slider.Root>
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <label className="text-xs text-foreground/60 mb-1 block">Desde</label>
          <input
            type="number"
            value={localValue[0]}
            onChange={(e) => {
              const newMin = Math.max(min, Math.min(Number(e.target.value), localValue[1]));
              handleValueChange([newMin, localValue[1]]);
            }}
            className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-principal/20 focus:border-principal"
            disabled={disabled}
            min={min}
            max={localValue[1]}
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-foreground/60 mb-1 block">Hasta</label>
          <input
            type="number"
            value={localValue[1]}
            onChange={(e) => {
              const newMax = Math.min(max, Math.max(Number(e.target.value), localValue[0]));
              handleValueChange([localValue[0], newMax]);
            }}
            className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-principal/20 focus:border-principal"
            disabled={disabled}
            min={localValue[0]}
            max={max}
          />
        </div>
      </div>
    </div>
  );
}

