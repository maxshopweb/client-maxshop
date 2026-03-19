"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { buildTiendaProductsUrl, useNavbarFilterData } from "../navbarFilters.shared";

interface NavbarFiltersMegaMenuProps {
  shouldShowBackground: boolean;
  actualTheme: "light" | "dark";
  triggerLabel?: string;
  isActive?: boolean;
}

function FilterColumn({
  title,
  items,
  activeValue,
  onAllClick,
  onItemClick,
  isLoading,
}: {
  title: string;
  items: { value: string; label: string }[];
  activeValue?: string | null;
  onAllClick: () => void;
  onItemClick: (value: string) => void;
  isLoading: boolean;
}) {
  return (
    <div className="min-w-[220px] flex-1">
      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
        {title}
      </h4>

      <div className="space-y-1">
        <button
          type="button"
          onClick={onAllClick}
          className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors truncate ${
            !activeValue ? "text-principal font-medium" : "text-foreground/70 hover:text-foreground"
          }`}
          title={`Todas las ${title.toLowerCase()}`}
        >
          Todas
        </button>

        {isLoading ? (
          <div className="px-2 py-2 text-xs text-foreground/50">Cargando...</div>
        ) : items.length === 0 ? (
          <div className="px-2 py-2 text-xs text-foreground/50">Sin resultados</div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-1">
              {items.map((item) => {
                const isActive = activeValue === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => onItemClick(item.value)}
                    className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors truncate ${
                      isActive
                        ? "text-principal font-medium bg-principal/10"
                        : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                    }`}
                    title={item.label}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NavbarFiltersMegaMenu({
  shouldShowBackground,
  actualTheme,
  triggerLabel = "Tienda",
  isActive = false,
}: NavbarFiltersMegaMenuProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

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

  const triggerTextClassName = shouldShowBackground
    ? actualTheme === "dark"
      ? "text-white"
      : "text-terciario"
    : "text-white";

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={`relative group py-2 px-1 flex flex-col items-center gap-0 transition-colors ${
            triggerTextClassName
          }`}
          aria-label={`Abrir filtros de ${triggerLabel.toLowerCase()}`}
        >
          <span className="inline-flex items-center gap-1.5 text-xs lg:text-sm tracking-wide">
            {triggerLabel}
            <ChevronDown className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity" />
          </span>
          <span
            className={`block h-px transition-all duration-300 ${
              shouldShowBackground ? "bg-principal" : "bg-white"
            } ${
              isActive ? "w-full" : "w-0 group-hover:w-full"
            }`}
          />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={8}
          className="p-0 border-0 bg-transparent z-50"
        >
          <div className="w-screen bg-white border-t border-card shadow-xl">
            <div className="container mx-auto px-4 py-5">
              <div className="flex items-start gap-8">
                <FilterColumn
                  title="Categorías"
                  items={categoriasItems}
                  activeValue={activeCategoria}
                  isLoading={isLoadingCategorias}
                  onAllClick={() => {
                    setOpen(false);
                    router.push(buildTiendaProductsUrl("categoria"));
                  }}
                  onItemClick={(value) => {
                    setOpen(false);
                    router.push(buildTiendaProductsUrl("categoria", value));
                  }}
                />

                <FilterColumn
                  title="Grupos"
                  items={gruposItems}
                  activeValue={activeGrupo}
                  isLoading={isLoadingGrupos}
                  onAllClick={() => {
                    setOpen(false);
                    router.push(buildTiendaProductsUrl("grupo"));
                  }}
                  onItemClick={(value) => {
                    setOpen(false);
                    router.push(buildTiendaProductsUrl("grupo", value));
                  }}
                />

                <FilterColumn
                  title="Marcas"
                  items={marcasItems}
                  activeValue={activeMarca}
                  isLoading={isLoadingMarcas}
                  onAllClick={() => {
                    setOpen(false);
                    router.push(buildTiendaProductsUrl("marca"));
                  }}
                  onItemClick={(value) => {
                    setOpen(false);
                    router.push(buildTiendaProductsUrl("marca", value));
                  }}
                />
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

