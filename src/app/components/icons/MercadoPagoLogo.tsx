"use client";

export default function MercadoPagoLogo({ className = "w-28 h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 50"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Logo Mercado Pago - Versión mejorada */}
      <g fill="currentColor">
        {/* M */}
        <path d="M5 5 L5 45 L12 45 L12 28 L20 28 L20 45 L27 45 L27 5 L20 5 L20 20 L12 20 L12 5 Z" />
        {/* P */}
        <path d="M32 5 L32 45 L45 45 Q50 45 50 40 L50 10 Q50 5 45 5 Z M38 15 L47 15 L47 35 L38 35 Z" />
      </g>
      {/* Texto "Mercado Pago" */}
      <text
        x="58"
        y="32"
        fontSize="16"
        fontWeight="600"
        fill="currentColor"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="0.5px"
      >
        Mercado Pago
      </text>
    </svg>
  );
}

