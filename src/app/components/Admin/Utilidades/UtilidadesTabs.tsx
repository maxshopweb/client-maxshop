'use client';

import type { MaestroKind } from '@/app/types/maestro.type';
import { MAESTRO_LABELS } from '@/app/types/maestro.type';
import { Tag, Package, Layers } from 'lucide-react';

const TAB_ICONS: Record<MaestroKind, React.ComponentType<{ className?: string }>> = {
  marca: Tag,
  categoria: Layers,
  grupo: Package,
};

interface UtilidadesTabsProps {
  activeTab: MaestroKind;
  onTabChange: (tab: MaestroKind) => void;
}

const TABS: MaestroKind[] = ['marca', 'categoria', 'grupo'];

export function UtilidadesTabs({ activeTab, onTabChange }: UtilidadesTabsProps) {
  return (
    <div
      className="flex gap-1 p-1 rounded-2xl border border-input bg-card/50"
      style={{ borderColor: 'rgba(var(--foreground-rgb), 0.12)' }}
    >
      {TABS.map((tab) => {
        const Icon = TAB_ICONS[tab];
        const label = MAESTRO_LABELS[tab].plural;
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
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
