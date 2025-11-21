export interface IGrupo {
  id_grupo: number;
  codi_grupo: string;
  nombre?: string | null;
  descripcion?: string | null;
  activo?: boolean | null;
  creado_en?: Date | null;
  actualizado_en?: Date | null;
}

export interface ICreateGrupoDTO {
  codi_grupo: string;
  nombre?: string;
  descripcion?: string;
}

export interface IUpdateGrupoDTO {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
}

export interface IGrupoResponse {
  success: boolean;
  data: IGrupo[];
  message?: string;
  error?: string;
}

