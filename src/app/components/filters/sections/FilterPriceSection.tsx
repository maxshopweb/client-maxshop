"use client";

import PriceSlider from "@/app/components/ui/PriceSlider";
import { motion } from "framer-motion";

interface FilterPriceSectionProps {
  min: number;
  max: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
}

export function FilterPriceSection({
  min,
  max,
  value,
  onValueChange,
}: FilterPriceSectionProps) {
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
      <PriceSlider min={min} max={max} value={value} onValueChange={onValueChange} />
    </motion.div>
  );
}

