"use client";

import Link from "next/link";
import { CONTACT_CONFIG, buildWhatsappUrl } from "@/app/config/contact.config";

const linkClassName =
  "text-principal underline underline-offset-2 hover:opacity-80 transition-opacity";

interface EmailLinkProps {
  label?: string;
  className?: string;
}

export function EmailLink({ label, className }: EmailLinkProps) {
  return (
    <Link href={CONTACT_CONFIG.email.href} className={className ?? linkClassName}>
      {label ?? CONTACT_CONFIG.email.address}
    </Link>
  );
}

interface WhatsappLinkProps {
  message?: string;
  label?: string;
  className?: string;
}

export function WhatsappLink({ message, label, className }: WhatsappLinkProps) {
  const href = buildWhatsappUrl(message ?? CONTACT_CONFIG.advisor.whatsappMessage);

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? linkClassName}
    >
      {label ?? CONTACT_CONFIG.whatsapp.display}
    </Link>
  );
}

interface ComprobanteNoticeProps {
  orderId?: string | null;
}

export function ComprobanteNotice({ orderId }: ComprobanteNoticeProps) {
  const whatsappMessage = orderId
    ? `Hola! Realicé el pago del pedido #${orderId}. Adjunto comprobante.`
    : undefined;

  return (
    <div
      className="rounded-lg border px-4 py-3 text-sm leading-relaxed"
      style={{
        backgroundColor: "rgba(255, 243, 205, 0.6)",
        borderColor: "rgba(255, 193, 7, 0.5)",
        color: "rgba(133, 100, 4, 1)",
      }}
    >
      <p>
        <strong>Importante:</strong> Una vez realizado el pago, enviá el comprobante por{" "}
        <EmailLink label="email" className="font-medium underline underline-offset-2 hover:opacity-80" /> o{" "}
        <WhatsappLink
          message={whatsappMessage}
          label={`WhatsApp (${CONTACT_CONFIG.whatsapp.display})`}
          className="font-medium underline underline-offset-2 hover:opacity-80"
        />
        . Tu pedido será confirmado y procesado inmediatamente.
      </p>
    </div>
  );
}
