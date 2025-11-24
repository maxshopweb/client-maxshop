"use client";

const promoMessages = [
  "50% OFF EN PRODUCTOS SELECCIONADOS",
  "ENVÍO GRATIS EN COMPRAS MAYORES A $50.000",
  "OFERTAS RELÁMPAGO - SOLO HOY",
  "3X2 EN HERRAMIENTAS ELÉCTRICAS",
  "12 CUOTAS SIN INTERÉS",
];

export default function PromoBanner() {
  // Unir todos los mensajes con " / "
  const combinedMessage = promoMessages.join(" / ");
  
  return (
    <div className="fixed top-0 left-0 right-0 z-[50] bg-secundario text-white h-10 overflow-hidden">
      <div className="relative h-full flex items-center">
        {/* Contenedor de animación infinita */}
        <div className="flex animate-scroll-infinite whitespace-nowrap">
          {/* Duplicar el mensaje combinado para animación continua */}
          {[combinedMessage, combinedMessage].map((message, index) => (
            <div
              key={index}
              className="flex items-center mx-8 text-xs md:text-sm font-medium uppercase"
            >
              <span>{message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

