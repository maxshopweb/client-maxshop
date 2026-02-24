'use client';

import { type ReactNode } from 'react';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral'
  | 'info'
  | 'principal'
  | 'mercadopago'
  | 'purple'
  | 'indigo'
  | 'errorDark';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const baseBadgeClasses =
  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border';

// Estilos idénticos a VentasColumns (efectivo, estado_pago, estado_envio): borde oscuro + fondo claro
export const badgeVariantStyles: Record<BadgeVariant, React.CSSProperties> = {
  // success = efectivo / aprobado / entregado
  success: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgb(22, 163, 74)',
    color: 'rgb(22, 163, 74)',
    boxShadow: '0 2px 4px rgba(34, 197, 94, 0.15)',
  },
  // error = rechazado
  error: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgb(220, 38, 38)',
    color: 'rgb(220, 38, 38)',
    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.15)',
  },
  // errorDark = vencido
  errorDark: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    borderColor: 'rgb(185, 28, 28)',
    color: 'rgb(185, 28, 28)',
    boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)',
  },
  // neutral = cancelado / default
  neutral: {
    backgroundColor: 'rgba(107, 114, 128, 0.15)',
    borderColor: 'rgb(107, 114, 128)',
    color: 'rgb(75, 85, 99)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  // warning = amber
  warning: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgb(217, 119, 6)',
    color: 'rgb(180, 83, 9)',
    boxShadow: '0 2px 4px rgba(245, 158, 11, 0.15)',
  },
  // info = preparando (blue)
  info: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgb(37, 99, 235)',
    color: 'rgb(37, 99, 235)',
    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.15)',
  },
  // principal = pendiente / transferencia
  principal: {
    backgroundColor: 'rgba(var(--principal-rgb), 0.15)',
    borderColor: 'var(--principal)',
    color: 'var(--principal)',
    boxShadow: '0 2px 4px rgba(var(--principal-rgb), 0.1)',
  },
  // mercadopago
  mercadopago: {
    backgroundColor: 'rgba(var(--mercadopago-rgb), 0.15)',
    borderColor: 'var(--mercadopago)',
    color: 'var(--mercadopago)',
    boxShadow: '0 2px 4px rgba(var(--mercadopago-rgb), 0.1)',
  },
  // purple = enviado
  purple: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: 'rgb(126, 34, 206)',
    color: 'rgb(126, 34, 206)',
    boxShadow: '0 2px 4px rgba(168, 85, 247, 0.15)',
  },
  // indigo = en_transito
  indigo: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderColor: 'rgb(79, 70, 229)',
    color: 'rgb(79, 70, 229)',
    boxShadow: '0 2px 4px rgba(99, 102, 241, 0.15)',
  },
};

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  const style = badgeVariantStyles[variant];
  return (
    <span
      className={`${baseBadgeClasses} ${className}`.trim()}
      style={style}
    >
      {children}
    </span>
  );
}
