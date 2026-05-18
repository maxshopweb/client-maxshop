"use client";

import PriceSlider from "@/app/components/ui/PriceSlider";
import { motion } from "framer-motion";

interface FilterPriceSectionProps {
  min: number;
  max: number;
  catalogMin: number;
  catalogMax: number;
  value: [number, number];
  maxPrice?: number;
  onValueChange: (value: [number, number]) => void;
}

export function FilterPriceSection({
  min,
  max,
  catalogMin,
  catalogMax,
  value,
  maxPrice,
  onValueChange,
}: FilterPriceSectionProps) {
  const maxFilterActive = maxPrice !== undefined && maxPrice > 0;

  return (
    <motion.div
      className="space-y-4 p-4 border border-input rounded-lg bg-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-base font-semibold text-foreground uppercase tracking-wide">
        Filtrar por Precio
      </h3>
      <PriceSlider
        min={min}
        max={max}
        catalogMin={catalogMin}
        catalogMax={catalogMax}
        value={value}
        maxFilterActive={maxFilterActive}
        onValueChange={onValueChange}
      />
    </motion.div>
  );
}
