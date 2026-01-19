"use client";

import { motion } from "framer-motion";
import { FormEventHandler, ReactNode } from "react";

interface ContactFormLayoutProps {
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
}

export function ContactFormLayout({ onSubmit, children }: ContactFormLayoutProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-foreground mb-6">Información de contacto</h2>

      <form onSubmit={onSubmit} className="space-y-6">
        {children}
      </form>
    </motion.div>
  );
}

