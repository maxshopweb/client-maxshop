export interface IMarca {
    id_marca: number;
    nombre?: string | null;
    descripcion?: string | null;
}

export interface ICreateMarcaDTO { 
    nombre: string;
    descripcion?: string;
}

export interface MarcaResponse {
    success: boolean;
    data: IMarca[];
    message: string;
}