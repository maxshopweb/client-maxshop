"use client";

import { motion } from "framer-motion";

interface FilterSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function FilterSearchInput({
  value,
  onChange,
  placeholder = "Buscar productos...",
}: FilterSearchInputProps) {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-4 pr-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-principal/20 focus:border-principal transition-all"
        />
      </div>
    </motion.div>
  );
}

