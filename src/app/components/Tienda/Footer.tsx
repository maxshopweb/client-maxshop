"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
import { Button } from "@/app/components/ui/Button";

export default function Footer() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de envío
    setFormData({ nombre: "", apellido: "", email: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* Footer Superior - 4 Columnas */}
      <footer className="bg-terciario text-white" id="contacto">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-8">
            {/* Columna 1 - Logo */}
            <div className="flex flex-col">
              <Link href="/" className="mb-4">
                <Image
                  src="/logos/logo-positivo.svg"
                  alt="MaxShop"
                  width={140}
                  height={50}
                  className="h-10 md:h-12 w-auto"
                />
              </Link>
              <p className="text-white/70 text-sm md:text-base leading-relaxed capitalize">
                Tu tienda especializada en herramientas profesionales y soluciones integrales para construcción.
              </p>
            </div>

            {/* Columna 2 - Contacto */}
            <div>
              <h3 className="text-lg md:text-xl mb-4 md:mb-6 text-principal capitalize">
                Contacto
              </h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-principal mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white/90 text-sm md:text-base leading-relaxed capitalize">
                      Punta del Sauce 1826<br />
                      Córdoba Capital, Argentina
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-principal flex-shrink-0" />
                  <Link 
                    href="tel:+541234567890" 
                    className="text-white/90 hover:text-principal transition-colors text-sm md:text-base capitalize"
                  >
                    +54 9 11 7150-6220
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-principal flex-shrink-0" />
                  <Link 
                    href="mailto:info@maxshop.com" 
                    className="text-white/90 hover:text-principal transition-colors text-sm md:text-base"
                  >
                    info@maxshop.com
                  </Link>
                </div>
              </div>
            </div>

            {/* Columna 3 - Redes Sociales */}
            <div>
              <h3 className="text-lg md:text-xl mb-4 md:mb-6 text-principal capitalize">
                Redes sociales
              </h3>
              <div className="flex items-center gap-3 md:gap-4">
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/5 hover:bg-principal flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </Link>
                <Link
                  href="https://instagram.com/maxshop.ar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/5 hover:bg-principal flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </Link>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/5 hover:bg-principal flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Twitter"
                >
                  <FaWhatsapp size={20} />
                </Link>
              </div>
            </div>

            {/* Columna 4 - Formulario de Contacto */}
            <div>
              <h3 className="text-lg md:text-xl mb-4 md:mb-6 text-principal capitalize">
                Suscríbete
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-principal text-sm transition-all capitalize"
                  required
                />
                <input
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-principal text-sm transition-all capitalize"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-principal text-sm transition-all"
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  className="mt-2"
                >
                  Enviar
                </Button>
              </form>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer Inferior - Full Width Azul Más Oscuro */}
      <div className="w-full text-white/60 py-4 md:py-5" style={{ backgroundColor: '#05060f' }}>
        <div className="container mx-auto px-4">
          <p className="text-center text-sm md:text-base">
            &copy; {new Date().getFullYear()} MaxShop. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </>
  );
}

