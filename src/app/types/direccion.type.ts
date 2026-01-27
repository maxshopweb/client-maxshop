/**
 * Tipos para manejo de direcciones con OpenCage
 * Compatibles con el backend
 */

// DTO para respuesta normalizada de OpenCage (desde backend)
export interface IDireccionOpenCageDTO {
    direccion_formateada: string;
    calle?: string;
    numero?: string;
    ciudad?: string;
    provincia?: string;
    cod_postal?: string;
    pais?: string;
    latitud: number;
    longitud: number;
    confianza?: number;
}

// DTO para crear/actualizar dirección (enviar al backend)
export interface IDireccionDTO {
    direccion_usuario?: string;
    direccion_formateada?: string;
    calle?: string;
    numero?: string;
    ciudad?: string;
    provincia?: string;
    cod_postal?: string;
    pais?: string;
    latitud?: number;
    longitud?: number;
}

