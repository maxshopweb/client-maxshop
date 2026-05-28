"use client";

import { MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useConfigTienda } from "@/app/hooks/config/useConfigTienda";
import { getStorePickupInfo } from "@/app/config/storePickup.config";
import { WhatsappLink } from "@/app/components/contact/ContactLinks";

const iconRowClass = "flex items-start gap-2";
const iconClass = "mt-0.5 h-4 w-4 shrink-0 text-principal";

const STORE_PICKUP_WHATSAPP_MESSAGE =
  "Hola! Quiero consultar la dirección para retiro en tienda.";

export function StorePickupInfo() {
  const { data: config } = useConfigTienda();
  const { nombre, direccion, telefono, mapsEmbedUrl } = getStorePickupInfo(config);

  return (
    <div className="space-y-4">
      <p className="text-sm text-foreground/60">
        Retirarás tu pedido en nuestro local sin costo. Disponible entre 24 y 48 horas hábiles.
      </p>

      {mapsEmbedUrl && (
        <iframe
          title="Ubicación del local"
          src={mapsEmbedUrl}
          className="w-full h-48 rounded-lg border"
          style={{ borderColor: "rgba(23, 28, 53, 0.1)" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}

      <div className="text-sm space-y-2">
        <p className="font-medium text-foreground/90">{nombre}</p>

        {direccion ? (
          <p className={`${iconRowClass} text-foreground/70`}>
            <MapPin className={iconClass} aria-hidden />
            <span>{direccion}</span>
          </p>
        ) : (
          <p className={iconRowClass}>
            <MapPin className={`${iconClass} text-foreground/50`} aria-hidden />
            <WhatsappLink
              message={STORE_PICKUP_WHATSAPP_MESSAGE}
              label="Consultá la dirección por WhatsApp"
              className="inline-flex items-center gap-1.5 text-principal underline underline-offset-2 hover:opacity-80"
            />
          </p>
        )}

        <p className={`${iconRowClass} text-foreground/70`}>
          <FaWhatsapp className="mt-0.5 h-4 w-4 shrink-0 text-[#25D366]" aria-hidden />
          <WhatsappLink
            label={telefono}
            className="text-principal underline underline-offset-2 hover:opacity-80"
          />
        </p>
      </div>
    </div>
  );
}
