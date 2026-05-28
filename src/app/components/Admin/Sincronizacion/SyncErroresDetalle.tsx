'use client';

import { CheckCircle2, XCircle } from 'lucide-react';

export function SyncErroresDetalle({ errores }: { errores: string[] }) {
  if (!errores || errores.length === 0) {
    return (
      <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
        <CheckCircle2 size={12} aria-hidden />
        Sin errores registrados
      </p>
    );
  }
  return (
    <ul className="space-y-1 max-h-40 overflow-y-auto">
      {errores.map((e, i) => (
        <li key={i} className="text-xs flex items-start gap-1.5 text-red-700 dark:text-red-400">
          <XCircle size={11} className="flex-shrink-0 mt-0.5" aria-hidden />
          <span className="break-all">{e}</span>
        </li>
      ))}
    </ul>
  );
}
