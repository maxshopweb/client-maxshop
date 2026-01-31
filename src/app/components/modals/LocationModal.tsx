"use client";

import { useState, useEffect } from "react";
import SimpleModal from "./SimpleModal";
import { Search, Loader2, CheckCircle2 } from "lucide-react";
import { usePostalCodeSearch } from "@/app/hooks/cart/usePostalCodeSearch";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect?: (provincia: string, ciudad: string, nombreCompleto: string) => void;
}

export default function LocationModal({
  isOpen,
  onClose,
  onLocationSelect,
}: LocationModalProps) {
  const { searchByPostalCode, isLoading, error, setAddressDataStore, clearPostalCode, foundData } = usePostalCodeSearch();
  const [codigoPostal, setCodigoPostal] = useState<string>("");
  
  // Limpiar al cerrar el modal
  useEffect(() => {
    if (!isOpen) {
      setCodigoPostal("");
      clearPostalCode();
    }
  }, [isOpen, clearPostalCode]);

  const handlePostalCodeSearch = async () => {
    if (!/^[0-9]{4}$/.test(codigoPostal)) {
      return;
    }
    await searchByPostalCode(codigoPostal);
  };

  const onChangeCodigoPostal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCodigoPostal(value);
  };

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Ingrese su código postal"
      maxWidth="max-w-lg"
    >
      {(handleClose) => {
        const handleConfirmAddressData = async () => {
          // Usar el código postal de foundData si existe, sino el del input
          const cpToSave = foundData?.codigoPostal || codigoPostal;
          
          if (!foundData) {
            // Si no hay datos encontrados pero hay CP válido, guardar solo el CP
            if (/^[0-9]{4}$/.test(codigoPostal)) {
              await setAddressDataStore(cpToSave);
            }
          } else {
            // Si hay datos encontrados, guardar todo (incluyendo código postal)
            await setAddressDataStore(cpToSave);
          }
          
          // Notificar callback si existe
          if (onLocationSelect && foundData?.provincia && foundData?.ciudad) {
            onLocationSelect(
              foundData.provincia,
              foundData.ciudad,
              `${foundData.ciudad}, ${foundData.provincia}`
            );
          }
          
          // Cerrar con animación
          handleClose();
        };

        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Código Postal
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={codigoPostal}
                  onChange={onChangeCodigoPostal}
                  placeholder="Ej: 5000"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 appearance-none focus:outline-none focus:ring-2 focus:ring-principal/20 focus:shadow-sm bg-background text-foreground border-2 border-input/70 hover:border-principal/50 focus:border-principal disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                  }}
                />
                <button
                  type="button"
                  onClick={handlePostalCodeSearch}
                  disabled={isLoading || !/^[0-9]{4}$/.test(codigoPostal)}
                  className="px-6 py-3 rounded-lg bg-principal text-white font-medium hover:bg-principal/90 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Search size={18} />
                  )}
                  <span>Buscar</span>
                </button>
              </div>
            </div>

            {/* Mostrar resultado de búsqueda */}
            {foundData && !isLoading && foundData.ciudad && foundData.provincia && (
              <button
                type="button"
                onClick={handleConfirmAddressData}
                className="w-full p-4 rounded-lg bg-green-50 border-2 border-green-200 hover:bg-green-100 hover:border-green-300 transition-all duration-300 cursor-pointer text-left transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-green-700 font-medium">
                      {foundData.ciudad}, {foundData.provincia}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Click para seleccionar
                    </p>
                  </div>
                </div>
              </button>
            )}

            {/* Mostrar error */}
            {error && !isLoading && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
        );
      }}
    </SimpleModal>
  );
}
