"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { buildTiendaProductsUrl, useNavbarFilterData } from "../navbarFilters.shared";

interface MobileFiltersMenuProps {
  onBack: () => void;
  onApply: () => void;
}

function MobileFilterSection({
  title,
  activeValue,
  isLoading,
  items,
  onSelect,
}: {
  title: string;
  activeValue?: string | null;
  isLoading: boolean;
  items: { value: string; label: string }[];
  onSelect: (value?: string) => void;
}) {
  return (
    <section className="px-4 py-3 border-b border-white/10">
      <h4 className="text-xs uppercase tracking-wide text-white/70 mb-2">{title}</h4>
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => onSelect(undefined)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${
            !activeValue ? "bg-white/20 text-white font-medium" : "text-white/80 hover:bg-white/10 hover:text-white"
          }`}
          title={`Todas las ${title.toLowerCase()}`}
        >
          Todas
        </button>

        {isLoading ? (
          <div className="px-3 py-2 text-xs text-white/60">Cargando...</div>
        ) : items.length === 0 ? (
          <div className="px-3 py-2 text-xs text-white/60">Sin resultados</div>
        ) : (
          <div className="max-h-40 overflow-y-auto pr-1 space-y-1">
            {items.map((item) => {
              const isActive = activeValue === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onSelect(item.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${
                    isActive ? "bg-white/20 text-white font-medium" : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                  title={item.label}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default function MobileFiltersMenu({ onBack, onApply }: MobileFiltersMenuProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategoria = searchParams.get("categoria");
  const activeMarca = searchParams.get("marca");
  const activeGrupo = searchParams.get("grupo");

  const {
    categoriasItems,
    marcasItems,
    gruposItems,
    isLoadingCategorias,
    isLoadingMarcas,
    isLoadingGrupos,
  } = useNavbarFilterData();

  const applyFilter = (key: "categoria" | "marca" | "grupo", value?: string) => {
    router.push(buildTiendaProductsUrl(key, value));
    onApply();
  };

  return (
    <div className="absolute inset-0 bg-principal z-10 overflow-y-auto">
      <div className="flex items-center gap-2 p-4 border-b border-white/20 sticky top-0 bg-principal z-10">
        <button
          type="button"
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Volver al menú"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <h3 className="text-white font-semibold text-sm tracking-wide">Categorías</h3>
      </div>

      <MobileFilterSection
        title="Categorías"
        activeValue={activeCategoria}
        isLoading={isLoadingCategorias}
        items={categoriasItems}
        onSelect={(value) => applyFilter("categoria", value)}
      />

      <MobileFilterSection
        title="Grupos"
        activeValue={activeGrupo}
        isLoading={isLoadingGrupos}
        items={gruposItems}
        onSelect={(value) => applyFilter("grupo", value)}
      />

      <MobileFilterSection
        title="Marcas"
        activeValue={activeMarca}
        isLoading={isLoadingMarcas}
        items={marcasItems}
        onSelect={(value) => applyFilter("marca", value)}
      />
    </div>
  );
}

