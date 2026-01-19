"use client";

import { useState, useEffect } from "react";
import SimpleModal from "./SimpleModal";
import Select, { SelectOption } from "../ui/Select";
import { provincias, buscarPorCodigoPostal, obtenerCiudadesPorProvincia, obtenerNombreUbicacion } from "@/app/utils/ubicaciones";
import { MapPin, Search } from "lucide-react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (provincia: string, ciudad: string, nombreCompleto: string) => void;
  currentProvincia?: string;
  currentCiudad?: string;
}

export default function LocationModal({
  isOpen,
  onClose,
  onLocationSelect,
  currentProvincia,
  currentCiudad,
}: LocationModalProps) {
  const [selectedProvincia, setSelectedProvincia] = useState<string>(currentProvincia || "");
  const [selectedCiudad, setSelectedCiudad] = useState<string>(currentCiudad || "");
  const [codigoPostal, setCodigoPostal] = useState<string>("");
  const [modoBusqueda, setModoBusqueda] = useState<"select" | "codigo">("select");
  const [error, setError] = useState<string>("");

  // Opciones de provincias para el select
  const provinciaOptions: SelectOption[] = provincias.map((p) => ({
    value: p.value,
    label: p.label,
  }));

  // Opciones de ciudades basadas en la provincia seleccionada
  const ciudadOptions: SelectOption[] = selectedProvincia
    ? obtenerCiudadesPorProvincia(selectedProvincia).map((c) => ({
        value: c.value,
        label: c.label,
      }))
    : [];

  // Resetear ciudad cuando cambia la provincia
  useEffect(() => {
    if (selectedProvincia) {
      setSelectedCiudad("");
    }
  }, [selectedProvincia]);

  // Función para buscar por código postal
  const handleBuscarPorCodigo = () => {
    setError("");
    if (!codigoPostal.trim()) {
      setError("Por favor ingrese un código postal");
      return;
    }

    const resultado = buscarPorCodigoPostal(codigoPostal);
    if (resultado) {
      setSelectedProvincia(resultado.provincia);
      setSelectedCiudad(resultado.ciudad);
      setError("");
    } else {
      setError("No se encontró ubicación para ese código postal");
    }
  };

  // Función para confirmar selección
  const handleConfirmar = (handleClose: () => void) => {
    setError("");
    
    if (modoBusqueda === "codigo") {
      if (!codigoPostal.trim()) {
        setError("Por favor ingrese un código postal");
        return;
      }
      const resultado = buscarPorCodigoPostal(codigoPostal);
      if (!resultado) {
        setError("No se encontró ubicación para ese código postal");
        return;
      }
      const nombreCompleto = obtenerNombreUbicacion(resultado.provincia, resultado.ciudad);
      onLocationSelect(resultado.provincia, resultado.ciudad, nombreCompleto);
    } else {
      if (!selectedProvincia || !selectedCiudad) {
        setError("Por favor seleccione provincia y ciudad");
        return;
      }
      const nombreCompleto = obtenerNombreUbicacion(selectedProvincia, selectedCiudad);
      onLocationSelect(selectedProvincia, selectedCiudad, nombreCompleto);
    }
    
    handleClose();
  };

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Seleccionar ubicación"
      maxWidth="max-w-lg"
      actions={(handleClose) => (
        <>
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 rounded-lg border-2 border-input/70 text-foreground font-medium hover:bg-input/20 transition-all duration-200"
            style={{
              borderColor: 'var(--input)',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={() => handleConfirmar(handleClose)}
            className="flex-1 px-4 py-3 rounded-lg bg-principal text-white font-medium hover:bg-principal/90 transition-all duration-200"
          >
            Confirmar
          </button>
        </>
      )}
    >
      <div className="space-y-6">
        {/* Tabs para cambiar modo de búsqueda */}
        <div className="flex gap-2 border-b border-input/30 pb-2">
          <button
            onClick={() => {
              setModoBusqueda("select");
              setError("");
            }}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              modoBusqueda === "select"
                ? "bg-principal text-white font-medium"
                : "text-foreground/70 hover:text-foreground hover:bg-input/20"
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>Seleccionar</span>
            </div>
          </button>
          <button
            onClick={() => {
              setModoBusqueda("codigo");
              setError("");
            }}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              modoBusqueda === "codigo"
                ? "bg-principal text-white font-medium"
                : "text-foreground/70 hover:text-foreground hover:bg-input/20"
            }`}
          >
            <div className="flex items-center gap-2">
              <Search size={16} />
              <span>Código Postal</span>
            </div>
          </button>
        </div>

        {/* Contenido según el modo */}
        {modoBusqueda === "select" ? (
          <div className="space-y-4">
            <Select
              label="Provincia"
              options={provinciaOptions}
              value={selectedProvincia}
              onChange={(value) => setSelectedProvincia(value as string)}
              placeholder="Seleccione una provincia"
            />

            <Select
              label="Ciudad"
              options={ciudadOptions}
              value={selectedCiudad}
              onChange={(value) => setSelectedCiudad(value as string)}
              placeholder={
                selectedProvincia
                  ? "Seleccione una ciudad"
                  : "Primero seleccione una provincia"
              }
              disabled={!selectedProvincia}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Código Postal
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={codigoPostal}
                  onChange={(e) => {
                    setCodigoPostal(e.target.value);
                    setError("");
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleBuscarPorCodigo();
                    }
                  }}
                  placeholder="Ej: 5000"
                  className="flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 appearance-none focus:outline-none focus:ring-2 focus:ring-principal/20 focus:shadow-sm bg-background text-foreground border-2 border-input/70 hover:border-principal/50 focus:border-principal"
                  style={{
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                  }}
                />
                <button
                  onClick={handleBuscarPorCodigo}
                  className="px-6 py-3 rounded-lg bg-principal text-white font-medium hover:bg-principal/90 transition-all duration-200 flex items-center gap-2"
                >
                  <Search size={18} />
                  <span>Buscar</span>
                </button>
              </div>
              {selectedProvincia && selectedCiudad && (
                <div className="mt-3 p-3 rounded-lg bg-principal/10 border border-principal/20">
                  <p className="text-sm" style={{ color: 'var(--foreground)' }}>
                    <strong>Ubicación encontrada:</strong>{" "}
                    {obtenerNombreUbicacion(selectedProvincia, selectedCiudad)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}
      </div>
    </SimpleModal>
  );
}

