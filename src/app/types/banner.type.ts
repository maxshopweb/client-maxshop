export type BannerTipo = 'desktop' | 'mobile';

export interface IBanner {
  id: number;
  orden: number;
  tipo: BannerTipo;
  path_img: string | null;
  link: string | null;
  activo: boolean;
  creado_en: string;
  actualizado_en: string;
  url: string | null;
}

export interface ICreateBannerDTO {
  orden: number;
  tipo: BannerTipo;
  link?: string;
}

export interface IUpdateBannerDTO {
  orden?: number;
  link?: string;
}

export type IBannerPublic = Pick<IBanner, 'id' | 'orden' | 'tipo' | 'path_img' | 'link' | 'url'>;
