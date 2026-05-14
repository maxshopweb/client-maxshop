"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useWhatsapp } from "@/app/hooks/contact/useWhatsapp";
import { CONTACT_CONFIG, SOCIAL_LINKS } from "@/app/config/contact.config";

const LEGAL_LINKS = [
  { label: "Política de privacidad", href: "/" },
  { label: "Términos y condiciones", href: "/" },
  { label: "Política de devoluciones", href: "/politica-de-devoluciones" },
  { label: "Iniciar sesión", href: "/login" },
] as const;

export default function Footer() {
  const { display: whatsappDisplay, buildUrl } = useWhatsapp();

  return (
    <>
      {/* Footer Superior */}
      <footer className="bg-neutral-100 text-neutral-800" id="contacto">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-8">

            {/* Columna 1 - Logo */}
            <div className="flex flex-col">
              <Link href="/" className="mb-4">
                <Image
                  src="/logos/logo-negativo.svg"
                  alt="MaxShop"
                  width={300}
                  height={300}
                  className="h-15 md:h-25 w-auto"
                />
              </Link>
            </div>

            {/* Columna 2 - Contacto */}
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4 md:mb-6">
                Contacto
              </h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    Av. Leandro Alem 1646 Local 2<br />
                    Córdoba Capital, Argentina
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                  <Link
                    href={buildUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm"
                  >
                    {whatsappDisplay}
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                  <Link
                    href={CONTACT_CONFIG.email.href}
                    className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm"
                  >
                    {CONTACT_CONFIG.email.address}
                  </Link>
                </div>
              </div>
            </div>

            {/* Columna 3 - Redes Sociales */}
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4 md:mb-6">
                Redes sociales
              </h3>
              <div className="flex items-center gap-3">
                <Link
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-md bg-neutral-200 border border-neutral-300 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </Link>
                <Link
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-md bg-neutral-200 border border-neutral-300 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </Link>
                <Link
                  href={buildUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-md bg-neutral-200 border border-neutral-300 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp size={16} />
                </Link>
              </div>
            </div>

            {/* Columna 4 - Información */}
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4 md:mb-6">
                Información
              </h3>
              <ul className="space-y-2.5">
                {LEGAL_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer Inferior */}
      <div className="w-full bg-neutral-200 py-4 md:py-5">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-neutral-400">
            &copy; {new Date().getFullYear()} MaxShop. Todos los derechos reservados.
          </p>
          <Link
            href="https://gentiomkt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            Hecho por <span className="font-medium">GentioMKT</span>
          </Link>
        </div>
      </div>
    </>
  );
}

