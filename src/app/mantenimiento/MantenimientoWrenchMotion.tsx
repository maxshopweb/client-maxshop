"use client";

import { motion } from "framer-motion";
import { Wrench } from "lucide-react";

export function MantenimientoWrenchMotion() {
  return (
    <motion.div
      className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm"
      animate={{ rotate: [0, -10, 10, -6, 6, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
      aria-hidden
    >
      <Wrench className="h-10 w-10 text-[var(--principal)]" strokeWidth={2} />
    </motion.div>
  );
}
