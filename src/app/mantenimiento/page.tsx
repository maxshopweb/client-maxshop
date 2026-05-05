import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Mail, MapPin, Phone, Facebook, Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { CONTACT_CONFIG, SOCIAL_LINKS } from "@/app/config/contact.config";
import type { IConfigTienda } from "@/app/types/config-tienda.type";
import { MantenimientoWrenchMotion } from "./MantenimientoWrenchMotion";

export const metadata: Metadata = {
  title: "En mantenimiento",
  robots: { index: false, follow: false },
};

const FALLBACK_DIRECCION = "Av. Leandro Alem 1646 Local 2\nCórdoba Capital, Argentina";

function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3001";
  return base.replace(/\/+$/, "");
}

async function fetchConfigTienda(): Promise<IConfigTienda | null> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/config/tienda/`, {
      next: { revalidate: 30 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { success?: boolean; data?: IConfigTienda };
    return json?.data ?? null;
  } catch {
    return null;
  }
}

function buildWhatsappUrl(): string {
  const digits = CONTACT_CONFIG.whatsapp.number.replace(/\D/g, "");
  const msg = encodeURIComponent(CONTACT_CONFIG.advisor.whatsappMessage);
  return `https://wa.me/${digits}?text=${msg}`;
}

export default async function MantenimientoPage() {
  const config = await fetchConfigTienda();
  const nombreTienda = config?.nombre?.trim() || "MaxShop";
  const direccion = config?.direccion?.trim() || FALLBACK_DIRECCION;
  const telefono = config?.telefono?.trim() || CONTACT_CONFIG.whatsapp.display;
  const logoSrc = config?.logo?.trim() || "/logos/logo-positivo.svg";
  const logoIsAbsolute = /^https?:\/\//i.test(logoSrc);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[var(--terciario)] text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.18]"
        style={{ backgroundImage: "url(/imgs/maxshop.jpg)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--secundario)]/95 via-[var(--terciario)]/92 to-[var(--terciario)]"
        aria-hidden
      />

      <main className="relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-6 py-16 text-center md:max-w-2xl md:px-8">
        <div className="mb-8 flex flex-col items-center gap-6">
          <div className="relative h-16 w-auto md:h-20">
            {logoIsAbsolute ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoSrc} alt={nombreTienda} className="h-full w-auto max-w-[220px] object-contain" />
            ) : (
              <Image
                src={logoSrc}
                alt={nombreTienda}
                width={220}
                height={80}
                className="h-16 w-auto object-contain md:h-20 drop-shadow-md"
                priority
              />
            )}
          </div>
          <MantenimientoWrenchMotion />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Estamos mejorando para vos
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/85 md:text-lg">
          Nuestra tienda online está en mantenimiento. Volvé más tarde o contactanos por WhatsApp, redes o en
          nuestro local.
        </p>

        <div className="my-10 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-[var(--principal)]/60 to-transparent" />

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--principal)]">
          Mientras tanto
        </p>

        <ul className="mt-8 w-full max-w-md space-y-4 text-left text-sm text-white/90 md:text-base">
          <li className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--principal)]" aria-hidden />
            <span className="whitespace-pre-line leading-relaxed">{direccion}</span>
          </li>
          <li className="flex items-center gap-3">
            <Phone className="h-5 w-5 shrink-0 text-[var(--principal)]" aria-hidden />
            <Link href={buildWhatsappUrl()} className="underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">
              {telefono}
            </Link>
          </li>
          <li className="flex items-center gap-3">
            <Mail className="h-5 w-5 shrink-0 text-[var(--principal)]" aria-hidden />
            <Link href={CONTACT_CONFIG.email.href} className="underline-offset-2 hover:underline">
              {CONTACT_CONFIG.email.address}
            </Link>
          </li>
        </ul>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white/90 transition-colors hover:border-[var(--principal)]/50 hover:bg-white/15 hover:text-white"
            aria-label="Facebook"
          >
            <Facebook size={18} />
          </Link>
          <Link
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white/90 transition-colors hover:border-[var(--principal)]/50 hover:bg-white/15 hover:text-white"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </Link>
          <Link
            href={buildWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 bg-[#25D366]/90 text-white transition-colors hover:bg-[#25D366]"
            aria-label="WhatsApp"
          >
            <FaWhatsapp size={20} />
          </Link>
        </div>

        <p className="mt-14 text-xs text-white/45">
          &copy; {new Date().getFullYear()} {nombreTienda}. Todos los derechos reservados.
        </p>
      </main>
    </div>
  );
}
