"use client";

import { motion } from "framer-motion";

interface CheckboxOption {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface FilterCheckboxSectionProps {
  title: string;
  options: CheckboxOption[];
}

export function FilterCheckboxSection({ title, options }: FilterCheckboxSectionProps) {
  return (
    <motion.div
      className="space-y-4 p-4 border border-input rounded-lg bg-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-base font-semibold text-foreground uppercase tracking-wide">{title}</h3>
      <div className="space-y-3">
        {options.map((option) => (
          <motion.div
            key={option.id}
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="checkbox"
              id={option.id}
              checked={option.checked}
              onChange={(e) => option.onChange(e.target.checked)}
              className="w-4 h-4 rounded border-input text-principal focus:ring-2 focus:ring-principal/20 focus:ring-offset-0 cursor-pointer"
            />
            <label
              htmlFor={option.id}
              className="flex items-center gap-2 text-sm text-foreground cursor-pointer"
            >
              <span>{option.label}</span>
            </label>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

