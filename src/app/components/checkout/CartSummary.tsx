"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useIsMutating } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";
import ProductCart from "@/app/components/cart/ProductCart";
import { formatCurrencyARS } from "@/app/utils/currency";
import { WhatsappLink } from "@/app/components/contact/ContactLinks";
import { cuponesService } from "@/app/services/cupones.service";
import { Button } from "@/app/components/ui/Button";
import { useConfigTienda } from "@/app/hooks/config/useConfigTienda";
import { computeDescuentoTransferencia } from "@/app/utils/precio-medios.utils";

interface CartSummaryProps {
  showProductList?: boolean;
}

export default function CartSummary({ showProductList = true }: CartSummaryProps) {
  const {
    cartItems,
    costoEnvio,
    tipoEntrega,
    codigoPostal,
    paymentMethod,
    codigoCupon,
    descuentoCupon,
    setCuponAplicado,
    clearCupon,
  } = useCheckoutStore();
  const { data: config } = useConfigTienda();
  const isMutatingEnvio = useIsMutating({ mutationKey: ["cotizarEnvio"] });
  const isAndreaniManualMode = process.env.NEXT_PUBLIC_ANDREANI_MODO_MANUAL === "true";

  const [showCoupon, setShowCoupon] = useState(false);
  const [codigoInput, setCodigoInput] = useState("");
  const [applying, setApplying] = useState(false);
  const revalidatingRef = useRef(false);

  const isCalculandoEnvio = useMemo(
    () =>
      tipoEntrega === "envio" &&
      !!codigoPostal &&
      (costoEnvio === null || costoEnvio === undefined) &&
      isMutatingEnvio > 0,
    [tipoEntrega, codigoPostal, costoEnvio, isMutatingEnvio]
  );

  const esTransferencia = paymentMethod === "transferencia";

  const {
    subtotal,
    subtotalSinImpuestos,
    envio,
    descuentoTransferencia,
    descuento,
    total,
    totalSinImpuestos,
    baseCupon,
  } = useMemo(() => {
    const sub = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const subSinImp = cartItems.reduce(
      (sum, item) => sum + (item.subtotalSinImpuestos ?? item.subtotal),
      0
    );
    const env = costoEnvio || 0;
    const descTransfer = esTransferencia
      ? computeDescuentoTransferencia(sub, config)
      : 0;
    const baseCuponCalc = Math.max(0, sub - descTransfer);
    const desc = Math.max(0, descuentoCupon || 0);
    const tot = Math.max(0, sub - descTransfer - desc + env);
    const totSinImp = Math.max(0, subSinImp - descTransfer - desc + env);
    return {
      subtotal: sub,
      subtotalSinImpuestos: subSinImp,
      envio: env,
      descuentoTransferencia: descTransfer,
      descuento: desc,
      total: tot,
      totalSinImpuestos: totSinImp,
      baseCupon: baseCuponCalc,
    };
  }, [cartItems, costoEnvio, descuentoCupon, esTransferencia, config]);

  // Si cambia el medio a transferencia (o el % de config), revalidar el cupón
  // contra el subtotal ya descontado.
  useEffect(() => {
    if (!codigoCupon || revalidatingRef.current) return;
    let cancelled = false;
    revalidatingRef.current = true;
    (async () => {
      try {
        const result = await cuponesService.validate(codigoCupon, baseCupon);
        if (cancelled) return;
        if (!result.valid || result.monto_descuento == null) {
          clearCupon();
          toast.error(result.message || "El cupón ya no aplica con este medio de pago");
          return;
        }
        setCuponAplicado(result.codigo || codigoCupon, result.monto_descuento);
      } catch {
        if (!cancelled) clearCupon();
      } finally {
        revalidatingRef.current = false;
      }
    })();
    return () => {
      cancelled = true;
      revalidatingRef.current = false;
    };
    // Solo cuando cambia la base del cupón o el código.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseCupon, codigoCupon]);

  const handleApply = async () => {
    const codigo = codigoInput.trim();
    if (!codigo) {
      toast.error("Ingresá un código promocional");
      return;
    }
    setApplying(true);
    try {
      const result = await cuponesService.validate(codigo, baseCupon);
      if (!result.valid || result.monto_descuento == null) {
        clearCupon();
        toast.error(result.message || "Cupón no válido");
        return;
      }
      setCuponAplicado(result.codigo || codigo.toUpperCase(), result.monto_descuento);
      setCodigoInput("");
      toast.success(result.message || "Cupón aplicado");
    } catch (e) {
      clearCupon();
      toast.error(e instanceof Error ? e.message : "No se pudo validar el cupón");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div
      className="rounded-xl p-6 md:sticky md:top-6"
      style={{
        backgroundColor: "var(--white)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h2 className="text-xl font-bold text-foreground mb-6">Resumen</h2>

      {showProductList && (
        <>
          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCart
                  item={item}
                  readOnly={true}
                  variant="sm"
                />
              </motion.div>
            ))}
          </div>

          <div
            className="border-t mb-4"
            style={{ borderColor: "rgba(23, 28, 53, 0.1)" }}
          />
        </>
      )}

      {/* Totales */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-foreground/70">Subtotal</span>
          <div className="text-right">
            <span className="text-foreground font-medium block">{formatCurrencyARS(subtotal)}</span>
            {subtotalSinImpuestos > 0 && (
              <span className="block text-[11px] text-foreground/50">
                Sin impuestos: {formatCurrencyARS(subtotalSinImpuestos)}
              </span>
            )}
          </div>
        </div>
        {descuentoTransferencia > 0 && (
          <div className="flex justify-between text-sm text-green-700">
            <span>Descuento por transferencia</span>
            <span className="font-medium">-{formatCurrencyARS(descuentoTransferencia)}</span>
          </div>
        )}
        {descuento > 0 && codigoCupon && (
          <div className="flex justify-between text-sm text-green-700">
            <span>
              Cupón{" "}
              <span className="font-mono font-semibold">{codigoCupon}</span>
            </span>
            <button
              type="button"
              className="font-medium hover:underline"
              onClick={() => clearCupon()}
              title="Quitar cupón"
            >
              -{formatCurrencyARS(descuento)}
            </button>
          </div>
        )}
        {tipoEntrega === "envio" && (
          <div className="flex justify-between text-sm">
            <span className="text-foreground/70">Costo de envío</span>
            {isAndreaniManualMode ? (
              <span className="text-foreground/60 text-xs">
                Se confirmará por <WhatsappLink className="text-foreground/60 underline underline-offset-2 hover:text-foreground" />
              </span>
            ) : isCalculandoEnvio ? (
              <span className="text-foreground/50 text-xs">Calculando...</span>
            ) : costoEnvio !== null && costoEnvio === 0 ? (
              <span className="text-foreground font-medium text-green-600">Envío gratis</span>
            ) : costoEnvio !== null && costoEnvio > 0 ? (
              <span className="text-foreground font-medium">{formatCurrencyARS(envio)}</span>
            ) : (
              <span className="text-foreground/50 text-xs">-</span>
            )}
          </div>
        )}
      </div>

      {/* Cupón */}
      <div className="mb-4">
        {!codigoCupon && (
          <button
            type="button"
            onClick={() => setShowCoupon((v) => !v)}
            className="text-sm font-medium underline-offset-2 hover:underline"
            style={{ color: "var(--principal)" }}
          >
            Tengo un código promocional
          </button>
        )}
        {(showCoupon || codigoCupon) && !codigoCupon && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={codigoInput}
              onChange={(e) => setCodigoInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleApply();
                }
              }}
              placeholder="código..."
              className="flex-1 border border-foreground/20 rounded-lg px-3 py-2 text-sm font-mono uppercase"
            />
            <Button
              variant="primary"
              size="sm"
              className="rounded-lg shrink-0"
              disabled={applying}
              onClick={() => void handleApply()}
            >
              {applying ? "..." : "Aplicar"}
            </Button>
          </div>
        )}
        {codigoCupon && (
          <button
            type="button"
            onClick={() => clearCupon()}
            className="mt-1 text-xs text-foreground/50 hover:text-foreground underline"
          >
            Quitar cupón
          </button>
        )}
      </div>

      {/* Separador */}
      <div
        className="border-t mb-4"
        style={{ borderColor: "rgba(23, 28, 53, 0.1)" }}
      />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-foreground">Total</span>
        <span
          className="text-2xl font-bold"
          style={{ color: "var(--principal)" }}
        >
          {isCalculandoEnvio ? (
            <span className="text-foreground/70 text-base font-medium">Calculando...</span>
          ) : (
            <>
              {formatCurrencyARS(total)}
              {totalSinImpuestos > 0 && (
                <span className="block text-[11px] text-foreground/50 italic mt-1 font-normal">
                  (Sin impuestos: {formatCurrencyARS(totalSinImpuestos)})
                </span>
              )}
            </>
          )}
        </span>
      </div>
    </div>
  );
}
