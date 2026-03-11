'use client';

import type { MaestroKind } from '@/app/types/maestro.type';
import { MAESTRO_LABELS } from '@/app/types/maestro.type';
import { Tag, Package, Layers, List } from 'lucide-react';

export type UtilidadesTabKind = MaestroKind | 'lista_precio';

const TAB_ICONS: Record<UtilidadesTabKind, React.ComponentType<{ className?: string }>> = {
  marca: Tag,
  categoria: Layers,
  grupo: Package,
  lista_precio: List,
};

const TAB_LABELS: Record<UtilidadesTabKind, string> = {
  ...MAESTRO_LABELS,
  lista_precio: 'Listas de precios',
};

interface UtilidadesTabsProps {
  activeTab: UtilidadesTabKind;
  onTabChange: (tab: UtilidadesTabKind) => void;
}

const TABS: UtilidadesTabKind[] = ['marca', 'categoria', 'grupo', 'lista_precio'];

export function UtilidadesTabs({ activeTab, onTabChange }: UtilidadesTabsProps) {
  return (
    <div
      className="flex gap-1 p-1 rounded-sm border border-input bg-card/50"
      style={{ borderColor: 'rgba(var(--foreground-rgb), 0.12)' }}
    >
      {TABS.map((tab) => {
        const Icon = TAB_ICONS[tab];
        const label = tab === 'lista_precio' ? TAB_LABELS[tab] : MAESTRO_LABELS[tab].plural;
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-medium transition-all
              ${isActive
                ? 'bg-principal text-white shadow-md'
                : 'text-input hover:bg-input/30'
              }
            `}
            style={isActive ? { backgroundColor: 'var(--principal)', color: 'white' } : undefined}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
