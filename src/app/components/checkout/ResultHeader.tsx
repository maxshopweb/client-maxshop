"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, XCircle, Info, Loader2 } from "lucide-react";

interface ResultHeaderProps {
  icono: string;
  titulo: string;
  color: 'success' | 'warning' | 'error' | 'info';
}

const iconMap = {
  CheckCircle2,
  Clock,
  XCircle,
  Info,
  Loader2,
};

const colorStyles = {
  success: {
    bg: "rgba(34, 197, 94, 0.1)",
    border: "rgba(34, 197, 94, 0.3)",
    icon: "text-green-600",
    iconBg: "bg-green-100",
  },
  warning: {
    bg: "rgba(251, 191, 36, 0.1)",
    border: "rgba(251, 191, 36, 0.3)",
    icon: "text-yellow-600",
    iconBg: "bg-yellow-100",
  },
  error: {
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.3)",
    icon: "text-red-600",
    iconBg: "bg-red-100",
  },
  info: {
    bg: "rgba(var(--principal-rgb), 0.1)",
    border: "rgba(var(--principal-rgb), 0.3)",
    icon: "text-principal",
    iconBg: "bg-principal/10",
  },
};

export default function ResultHeader({ icono, titulo, color }: ResultHeaderProps) {
  const IconComponent = iconMap[icono as keyof typeof iconMap] || Info;
  const styles = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center mb-8"
    >
      {/* Icono */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="flex justify-center mb-6"
      >
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center ${styles.iconBg}`}
          style={{
            border: `3px solid ${styles.border}`,
          }}
        >
          <IconComponent className={`w-12 h-12 ${styles.icon}`} />
        </div>
      </motion.div>

      {/* Título */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl md:text-4xl font-bold text-foreground mb-4"
      >
        {titulo}
      </motion.h1>
    </motion.div>
  );
}

