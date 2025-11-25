import Carousel from "../components/Tienda/Carousel";
import TitleSection from "../components/Tienda/TitleSection";
import ProductsCarousel from "../components/Tienda/ProductsCarousel";
import SmallCarousel from "../components/Tienda/SmallCarousel";
import ValueSection from "../components/Tienda/ValueSection";
import BenefitsCards from "../components/Tienda/BenefitsCards";
import ScrollAnimate from "../components/ui/ScrollAnimate";
import AboutUs from "../components/Tienda/AboutUs";

export default function TiendaHome() {
  return (
    <div className="flex flex-col">
      <section className="w-full h-screen md:h-screen min-h-[500px] -mt-[calc(3.5rem+3rem)] md:-mt-[calc(4rem+3.5rem)]">
        <Carousel />
      </section>
      
      <div className="flex flex-col">
      {/* <TitleSection /> */}

      <ScrollAnimate direction="up" delay={0}>
        <BenefitsCards />
      </ScrollAnimate>

      <ScrollAnimate direction="up" delay={0}>
        <ProductsCarousel
          title="Productos destacados"
          filter="destacados"
          showViewAllButton={true}
        />
      </ScrollAnimate>

      <ScrollAnimate direction="up" delay={100}>
        <SmallCarousel />
      </ScrollAnimate>

      <ScrollAnimate direction="up" delay={0}>
        <ProductsCarousel
          title="Puede interesarte"
          filter="destacados"
          showViewAllButton={true}
        />
      </ScrollAnimate>

      <ScrollAnimate direction="up" delay={100}>
        <ValueSection />
      </ScrollAnimate>

      <ScrollAnimate direction="up" delay={100}>
        <AboutUs/>
      </ScrollAnimate>
      </div>
    </div>
  );
}

