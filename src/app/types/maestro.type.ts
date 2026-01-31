import type { IMarca } from './marca.type';
import type { ICategoria } from './categoria.type';
import type { IGrupo } from './grupo.type';

export type MaestroKind = 'marca' | 'categoria' | 'grupo';

export type MaestroItem = IMarca | ICategoria | IGrupo;

export function getMaestroId(item: MaestroItem, kind: MaestroKind): number {
  if (kind === 'marca') return (item as IMarca).id_marca;
  if (kind === 'categoria') return (item as ICategoria).id_cat;
  return (item as IGrupo).id_grupo;
}

export function getMaestroCodigo(item: MaestroItem, kind: MaestroKind): string {
  if (kind === 'marca') return (item as IMarca).codi_marca;
  if (kind === 'categoria') return (item as ICategoria).codi_categoria;
  return (item as IGrupo).codi_grupo;
}

export function getMaestroNombre(item: MaestroItem): string | null {
  return (item as { nombre?: string | null }).nombre ?? null;
}

export function getMaestroDescripcion(item: MaestroItem): string | null {
  return (item as { descripcion?: string | null }).descripcion ?? null;
}

export const MAESTRO_LABELS: Record<MaestroKind, { singular: string; plural: string }> = {
  marca: { singular: 'Marca', plural: 'Marcas' },
  categoria: { singular: 'Categoría', plural: 'Categorías' },
  grupo: { singular: 'Grupo', plural: 'Grupos' },
};
