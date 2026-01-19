"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { IResultAction } from "../../types/checkout-result.type";

interface ResultActionsProps {
  acciones: IResultAction[];
}

export default function ResultActions({ acciones }: ResultActionsProps) {
  const router = useRouter();

  if (acciones.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
    >
      {acciones.map((accion, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 + index * 0.1 }}
          className="w-full sm:w-auto flex justify-center items-center"
        >
          <Button
            variant={accion.variant}
            size="lg"
            fullWidth={acciones.length === 1}
            onClick={() => {
              if (accion.onClick) {
                accion.onClick();
              } else if (accion.href) {
                router.push(accion.href);
              }
            }}
            className="w-full sm:w-auto"
          >
            {accion.label}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}

