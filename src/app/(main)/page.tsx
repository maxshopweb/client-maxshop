import ProductsCarousel from "../components/Tienda/ProductsCarousel";
import ProductsGrid from "../components/Tienda/ProductsGrid";
import ValueSection from "../components/Tienda/ValueSection";
import ScrollAnimate from "../components/ui/ScrollAnimate";
import HeroBanner from "../components/Tienda/HeroBanner";
// import AboutUs from "../components/Tienda/AboutUs"; /* contenido movido a ValueSection */

export default function TiendaHome() {
  return (
    <div className="flex flex-col">
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
