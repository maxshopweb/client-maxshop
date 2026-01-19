"use client";

import { motion } from "framer-motion";
import { Truck, Store } from "lucide-react";

interface TipoEntregaSelectorProps {
  selectedTipo: 'envio' | 'retiro' | undefined;
  costoEnvio: number | null;
  onSelect: (tipo: 'envio' | 'retiro') => void;
  error?: string;
}

export default function TipoEntregaSelector({
  selectedTipo,
  costoEnvio,
  onSelect,
  error,
}: TipoEntregaSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-foreground">
        Tipo de entrega *
      </label>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onSelect('envio')}
          className={`
            p-6 rounded-xl border-2 transition-all
            ${selectedTipo === 'envio'
              ? 'border-principal bg-principal/5 shadow-md'
              : 'border-foreground/10 hover:border-foreground/20'
            }
          `}
        >
          <Truck 
            className={`w-8 h-8 mx-auto mb-2 ${
              selectedTipo === 'envio' 
                ? 'text-principal' 
                : 'text-foreground/40'
            }`} 
          />
          <p className={`font-medium ${
            selectedTipo === 'envio' 
              ? 'text-principal' 
              : 'text-foreground'
          }`}>
            Envío a domicilio
          </p>
          {costoEnvio !== null && costoEnvio > 0 && selectedTipo === 'envio' && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-foreground/60 mt-1"
            >
              ${costoEnvio.toFixed(2)}
            </motion.p>
          )}
          {selectedTipo === 'envio' && costoEnvio === null && (
            <p className="text-xs text-foreground/50 mt-1">
              Se calculará automáticamente
            </p>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelect('retiro')}
          className={`
            p-6 rounded-xl border-2 transition-all
            ${selectedTipo === 'retiro'
              ? 'border-principal bg-principal/5 shadow-md'
              : 'border-foreground/10 hover:border-foreground/20'
            }
          `}
        >
          <Store 
            className={`w-8 h-8 mx-auto mb-2 ${
              selectedTipo === 'retiro' 
                ? 'text-principal' 
                : 'text-foreground/40'
            }`} 
          />
          <p className={`font-medium ${
            selectedTipo === 'retiro' 
              ? 'text-principal' 
              : 'text-foreground'
          }`}>
            Retiro en tienda
          </p>
          <p className="text-sm text-foreground/60 mt-1">
            Sin costo adicional
          </p>
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}


