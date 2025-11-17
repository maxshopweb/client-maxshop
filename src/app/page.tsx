import TopHeader from "./components/Tienda/TopHeader";
import NavigationBar from "./components/Tienda/NavigationBar";
import Carousel from "./components/Tienda/Carousel";
import TitleSection from "./components/Tienda/TitleSection";
import ProductsCarousel from "./components/Tienda/ProductsCarousel";
import SmallCarousel from "./components/Tienda/SmallCarousel";
import ValueSection from "./components/Tienda/ValueSection";
import Footer from "./components/Tienda/Footer";

export default function TiendaHome() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header - Logo, Búsqueda, Carrito */}
      <TopHeader />
      
      {/* Navigation Bar - Menú */}
      <NavigationBar />
      
      {/* Carousel - Imágenes Rotativas */}
      <Carousel />
      
      {/* Title Section - Título y Botón de Catálogo */}
      <TitleSection />

      {/* Products Carousel - PRODUCTOS EN OFERTA */}
      <ProductsCarousel 
        title="PRODUCTOS EN OFERTA" 
        filter="all"
        showViewAllButton={true}
      />

      {/* Small Carousel - Carrusel pequeño */}
      <SmallCarousel />

      {/* Products Carousel - PRODUCTOS DESTACADOS */}
      <ProductsCarousel 
        title="PRODUCTOS DESTACADOS" 
        filter="all"
        showViewAllButton={true}
      />

      {/* Value Section - VALOR AGREGADO */}
      <ValueSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
