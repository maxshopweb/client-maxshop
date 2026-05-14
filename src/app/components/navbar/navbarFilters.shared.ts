"use client";

import { useMemo } from "react";
import { useCategorias } from "@/app/hooks/categorias/useCategorias";
import { useMarcas } from "@/app/hooks/marcas/useMarcas";
import { useGrupos } from "@/app/hooks/grupos/useGrupos";
import type { ICategoria } from "@/app/types/categoria.type";
import type { IMarca } from "@/app/types/marca.type";
import type { IGrupo } from "@/app/types/grupo.type";

export type NavbarFilterKey = "categoria" | "marca" | "grupo";

export const truncateNavbarFilterLabel = (value: string, maxLength = 34) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3)}...`;
};

export const buildTiendaProductsUrl = (key: NavbarFilterKey, value?: string) => {
  const params = new URLSearchParams();
  params.set("page", "1");
  if (value && value.trim().length > 0) {
    params.set(key, value);
  }
  return `/tienda/productos?${params.toString()}`;
};

export function useNavbarFilterData() {
  const { data: categoriasResponse, isLoading: isLoadingCategorias } = useCategorias({ activeOnly: true });
  const { data: marcasResponse, isLoading: isLoadingMarcas } = useMarcas({ activeOnly: true });
  const { data: gruposResponse, isLoading: isLoadingGrupos } = useGrupos({ activeOnly: true });

  const categoriasItems = useMemo(
    () =>
      (categoriasResponse?.data || []).map((cat: ICategoria) => ({
        value: cat.codi_categoria,
        label: truncateNavbarFilterLabel(cat.nombre || cat.codi_categoria),
      })),
    [categoriasResponse]
  );

  const marcasItems = useMemo(
    () =>
      (marcasResponse?.data || []).map((marca: IMarca) => ({
        value: marca.codi_marca,
        label: truncateNavbarFilterLabel(marca.nombre || marca.codi_marca),
      })),
    [marcasResponse]
  );

  const gruposItems = useMemo(
    () =>
      (gruposResponse?.data || []).map((grupo: IGrupo) => ({
        value: grupo.codi_grupo,
        label: truncateNavbarFilterLabel(grupo.nombre || grupo.codi_grupo),
      })),
    [gruposResponse]
  );

  return {
    categoriasItems,
    marcasItems,
    gruposItems,
    isLoadingCategorias,
    isLoadingMarcas,
    isLoadingGrupos,
  };
}

