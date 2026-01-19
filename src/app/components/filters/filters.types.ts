export interface UrlFilters {
  busqueda?: string;
  precio_min?: number;
  precio_max?: number;
  id_cat?: number;
  id_marca?: number;
  codi_grupo?: string;
  destacado?: boolean;
  oferta?: boolean;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

