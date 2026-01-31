export interface IMarca {
    id_marca: number;
    codi_marca: string;
    nombre?: string | null;
    descripcion?: string | null;
    activo?: boolean | null;
    creado_en?: Date | null;
    actualizado_en?: Date | null;
}

export interface ICreateMarcaDTO {
    codi_marca: string;
    nombre: string;
    descripcion?: string;
}

export interface IUpdateMarcaDTO {
    nombre?: string;
    descripcion?: string;
}

export interface MarcaResponse {
    success: boolean;
    data: IMarca[];
    message?: string;
}