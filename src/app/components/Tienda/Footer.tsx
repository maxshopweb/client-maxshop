import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-terciario text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Acerca de Nosotros */}
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-4 md:mb-6 text-principal tracking-tight">
              ACERCA DE NOSOTROS
            </h3>
            <p className="text-white/90 mb-3 md:mb-4 leading-relaxed text-base md:text-lg font-medium">
              MaxShop es tu tienda especializada en herramientas profesionales y soluciones 
              integrales para construcción. Ofrecemos productos de alta calidad de las mejores 
              marcas del mercado, con atención personalizada y servicio de excelencia.
            </p>
            <p className="text-white/90 leading-relaxed text-base md:text-lg font-medium">
              Nuestro compromiso es brindarte las herramientas que necesitas para hacer realidad 
              tus proyectos, ya seas un profesional o un aficionado al bricolaje.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-4 md:mb-6 text-principal tracking-tight">
              CONTACTO
            </h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-principal mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-base md:text-lg mb-1">Dirección</p>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    Av. Principal 1234<br />
                    Ciudad, Provincia<br />
                    CP 1234
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 md:w-6 md:h-6 text-principal flex-shrink-0" />
                <div>
                  <p className="font-bold text-base md:text-lg mb-1">Teléfono</p>
                  <Link href="tel:+541234567890" className="text-white/90 hover:text-principal transition-colors text-sm md:text-base font-medium touch-manipulation">
                    +54 11 2345-6789
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-principal flex-shrink-0" />
                <div>
                  <p className="font-bold text-base md:text-lg mb-1">Email</p>
                  <Link href="mailto:info@maxshop.com" className="text-white/90 hover:text-principal transition-colors text-sm md:text-base font-medium touch-manipulation">
                    info@maxshop.com
                  </Link>
                </div>
              </div>

              {/* Redes Sociales */}
              <div className="flex items-center gap-3 md:gap-4 pt-3 md:pt-4">
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-principal flex items-center justify-center transition-colors touch-manipulation"
                  aria-label="Facebook"
                >
                  <Facebook size={18} className="md:w-5 md:h-5" />
                </Link>
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-principal flex items-center justify-center transition-colors touch-manipulation"
                  aria-label="Instagram"
                >
                  <Instagram size={18} className="md:w-5 md:h-5" />
                </Link>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-principal flex items-center justify-center transition-colors touch-manipulation"
                  aria-label="Twitter"
                >
                  <Twitter size={18} className="md:w-5 md:h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-white/60 text-sm md:text-base">
          <p>&copy; {new Date().getFullYear()} MaxShop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

