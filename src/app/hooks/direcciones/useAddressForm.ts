import { useState, useCallback, useMemo } from 'react';
import type { ICreateDireccionDTO, IDireccion } from '@/app/services/direcciones.service';

const initialFormData: ICreateDireccionDTO = {
  nombre: '',
  direccion: '',
  altura: '',
  piso: '',
  dpto: '',
  ciudad: '',
  provincia: '',
  cod_postal: null,
};

// Función para normalizar y comparar datos
const normalizeData = (data: ICreateDireccionDTO): ICreateDireccionDTO => {
  return {
    nombre: (data.nombre || '').trim(),
    direccion: (data.direccion || '').trim(),
    altura: (data.altura || '').trim(),
    piso: (data.piso || '').trim(),
    dpto: (data.dpto || '').trim(),
    ciudad: (data.ciudad || '').trim(),
    provincia: (data.provincia || '').trim(),
    cod_postal: data.cod_postal || null,
    es_principal: data.es_principal || false,
  };
};

const areEqual = (a: ICreateDireccionDTO, b: ICreateDireccionDTO): boolean => {
  const normalizedA = normalizeData(a);
  const normalizedB = normalizeData(b);
  
  return (
    normalizedA.nombre === normalizedB.nombre &&
    normalizedA.direccion === normalizedB.direccion &&
    normalizedA.altura === normalizedB.altura &&
    normalizedA.piso === normalizedB.piso &&
    normalizedA.dpto === normalizedB.dpto &&
    normalizedA.ciudad === normalizedB.ciudad &&
    normalizedA.provincia === normalizedB.provincia &&
    normalizedA.cod_postal === normalizedB.cod_postal &&
    normalizedA.es_principal === normalizedB.es_principal
  );
};

export function useAddressForm() {
  const [formData, setFormData] = useState<ICreateDireccionDTO>(initialFormData);
  const [originalData, setOriginalData] = useState<ICreateDireccionDTO | null>(null);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setOriginalData(null);
  }, []);

  const setFormDataFromDireccion = useCallback((direccion: IDireccion) => {
    const data: ICreateDireccionDTO = {
      nombre: direccion.nombre || '',
      direccion: direccion.direccion || '',
      altura: direccion.altura || '',
      piso: direccion.piso || '',
      dpto: direccion.dpto || '',
      ciudad: direccion.ciudad || '',
      provincia: direccion.provincia || '',
      cod_postal: direccion.cod_postal || null,
      es_principal: direccion.es_principal || false,
    };
    setFormData(data);
    setOriginalData(data);
  }, []);

  const updateFormData = useCallback((data: Partial<ICreateDireccionDTO>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  // Verificar si hay cambios
  const hasChanges = useMemo(() => {
    if (!originalData) return true; // Si no hay datos originales, permitir guardar (modo creación)
    return !areEqual(formData, originalData);
  }, [formData, originalData]);

  return {
    formData,
    setFormData,
    resetForm,
    setFormDataFromDireccion,
    updateFormData,
    hasChanges,
  };
}

