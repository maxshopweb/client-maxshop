import Carousel from "../components/Tienda/Carousel";
import TitleSection from "../components/Tienda/TitleSection";
import ProductsCarousel from "../components/Tienda/ProductsCarousel";
import ProductsGrid from "../components/Tienda/ProductsGrid";
import SmallCarousel from "../components/Tienda/SmallCarousel";
import ValueSection from "../components/Tienda/ValueSection";
import BenefitsCards from "../components/Tienda/BenefitsCards";
import ScrollAnimate from "../components/ui/ScrollAnimate";
// import AboutUs from "../components/Tienda/AboutUs"; /* contenido movido a ValueSection */
import HeroBanner from "../components/Tienda/HeroBanner";

export default function TiendaHome() {
  return (
    <div className="flex flex-col">
      {/* <section className="w-full -mt-[160px] h-[calc(300px+160px)] md:h-[calc(600px+160px)]">
        <Carousel />
      </section>
       */}

      <div className="flex flex-col gap-8 md:gap-14">
        <section className="relative z-0 w-full md:-mt-[172px]">
          <HeroBanner />
        </section>


        <div className="flex flex-col gap-8 md:gap-14">
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
        </div>

        <div className="flex flex-col gap-8 md:gap-14">
          <ScrollAnimate direction="up" delay={0}>
            <ProductsGrid
              title="Puede interesarte"
              filter="publicados"
              showViewAllButton={true}
              rows={2}
              cols={4}
            />
          </ScrollAnimate>

          <div className="flex flex-col">
            <ScrollAnimate direction="up" delay={100}>
              <ValueSection />
            </ScrollAnimate>

            {/* <ScrollAnimate direction="up" delay={100}>
              <AboutUs />
            </ScrollAnimate> */}
          </div>
        </div>
      </div>
    </div>
  );
}

