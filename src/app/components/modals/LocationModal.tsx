"use client";

import { useState, useEffect } from "react";
import SimpleModal from "./SimpleModal";
import { Search, Loader2, CheckCircle2 } from "lucide-react";
import { usePostalCodeSearch } from "@/app/hooks/cart/usePostalCodeSearch";
import Input from "../ui/Input";

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

  useEffect(() => {
    if (!isOpen) {
      setCodigoPostal("");
      clearPostalCode();
    }
  }, [isOpen, clearPostalCode]);

  const handlePostalCodeSearch = async () => {
    if (!/^[0-9]{4}$/.test(codigoPostal)) return;
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
      maxWidth="max-w-md sm:max-w-lg"
    >
      {(handleClose) => {
        const handleConfirmAddressData = async () => {
          const cpToSave = foundData?.codigoPostal || codigoPostal;

          if (/^[0-9]{4}$/.test(cpToSave)) {
            await setAddressDataStore(cpToSave);
          }

          if (onLocationSelect && foundData?.provincia && foundData?.ciudad) {
            onLocationSelect(
              foundData.provincia,
              foundData.ciudad,
              `${foundData.ciudad}, ${foundData.provincia}`
            );
          }

          handleClose();
        };

        return (
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-foreground">
                Código Postal
              </label>

              <div className="flex gap-2">
                <Input
                  type="number"
                  value={codigoPostal}
                  onChange={onChangeCodigoPostal}
                  placeholder="Ej: 5000"
                  disabled={isLoading}
                  className="flex-1"
                />

                <button
                  type="button"
                  onClick={handlePostalCodeSearch}
                  disabled={isLoading || !/^[0-9]{4}$/.test(codigoPostal)}
                  className="px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-principal text-white text-xs sm:text-sm font-medium hover:bg-principal/90 transition-all duration-200 flex items-center gap-1.5 sm:gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Search size={16} />
                  )}
                  <span className="hidden sm:inline">Buscar</span>
                </button>
              </div>
            </div>

            {/* Resultado */}
            {foundData && !isLoading && foundData.ciudad && foundData.provincia && (
              <button
                type="button"
                onClick={handleConfirmAddressData}
                className="w-full p-3 sm:p-4 rounded-lg bg-green-50 border-2 border-green-200 hover:bg-green-100 transition-all duration-300 text-left"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-green-700 font-medium">
                      {foundData.ciudad}, {foundData.provincia}
                    </p>
                    <p className="text-[10px] sm:text-xs text-green-600 mt-0.5 sm:mt-1">
                      Tap para seleccionar
                    </p>
                  </div>
                </div>
              </button>
            )}

            {/* Error */}
            {error && !isLoading && (
              <div className="p-2.5 sm:p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-xs sm:text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
        );
      }}
    </SimpleModal>
  );
}