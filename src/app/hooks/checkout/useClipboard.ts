"use client";

import { useState, useCallback } from "react";

interface UseClipboardOptions {
  onSuccess?: (text: string) => void;
  onError?: (error: Error) => void;
  timeout?: number; // Tiempo en ms para resetear el estado "copied"
}

/**
 * Hook reutilizable para copiar texto al portapapeles
 * 
 * @returns {Object} - { copy, copied, isSupported }
 */
export function useClipboard(options: UseClipboardOptions = {}) {
  const { onSuccess, onError, timeout = 2000 } = options;
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback(
    async (text: string, field?: string) => {
      // Verificar soporte del navegador
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        const error = new Error("Clipboard API no está disponible");
        onError?.(error);
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(field || "default");
        
        // Resetear después del timeout
        setTimeout(() => {
          setCopied(null);
        }, timeout);

        onSuccess?.(text);
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Error al copiar");
        onError?.(error);
        return false;
      }
    },
    [onSuccess, onError, timeout]
  );

  const isSupported = typeof navigator !== "undefined" && 
                     !!navigator.clipboard && 
                     !!navigator.clipboard.writeText;

  return {
    copy,
    copied,
    isSupported,
  };
}

