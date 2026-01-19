"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";

interface FiltersHeaderProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  showMobile?: boolean;
}

export function FiltersHeader({
  hasActiveFilters,
  onClearFilters,
  showMobile = false,
}: FiltersHeaderProps) {
  if (!hasActiveFilters) {
    return (
      <div className={showMobile ? "lg:hidden mb-2" : "hidden lg:flex items-center justify-between mb-2"}>
        <h2 className="text-lg font-semibold text-foreground">Filtros</h2>
      </div>
    );
  }

  return (
    <motion.div
      className={showMobile ? "lg:hidden flex justify-end mb-2" : "hidden lg:flex items-center justify-between mb-2"}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {!showMobile && <h2 className="text-lg font-semibold text-foreground">Filtros</h2>}
      <motion.button
        onClick={onClearFilters}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-lg transition-all duration-200 border border-transparent hover:border-destructive/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <X className="w-3.5 h-3.5" />
        {showMobile ? "Limpiar filtros" : "Limpiar"}
      </motion.button>
    </motion.div>
  );
}

