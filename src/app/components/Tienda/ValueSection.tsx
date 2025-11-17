import Link from "next/link";

const valueCards = [
  {
    image: "/value/value-1.jpg",
    title: "Herramientas Profesionales",
    description: "Equipamiento de alta calidad para profesionales de la construcción",
    link: "/tienda/productos?categoria=herramientas",
  },
  {
    image: "/value/value-2.jpg",
    title: "Soluciones Integrales",
    description: "Todo lo que necesitas para tus proyectos de construcción y renovación",
    link: "/tienda/productos?categoria=construccion",
  },
];

export default function ValueSection() {
  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          {valueCards.map((card, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Imagen */}
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay oscuro */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              {/* Contenido */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 md:mb-3 drop-shadow-lg">{card.title}</h3>
                <p className="text-white/95 mb-3 md:mb-5 text-sm sm:text-base md:text-lg leading-relaxed font-medium">{card.description}</p>
                <Link
                  href={card.link}
                  className="group inline-flex items-center gap-2 text-principal hover:text-principal/90 font-bold text-base md:text-lg transition-all duration-300 touch-manipulation"
                >
                  <span className="underline decoration-2 underline-offset-4 decoration-principal group-hover:decoration-principal/70">
                    Ver Productos
                  </span>
                  <span className="transform group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

