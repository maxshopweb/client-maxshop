import TopHeader from "@/app/components/Tienda/TopHeader";
import NavigationBar from "@/app/components/Tienda/NavigationBar";
import Footer from "@/app/components/Tienda/Footer";
import PromoBanner from "@/app/components/Tienda/PromoBanner";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Banner promocional fijo - Arriba del todo */}
      <PromoBanner />
      
      {/* Navbars Container - Sticky Together - Fixed in all pages */}
      <div className="sticky top-10 z-50">
        <TopHeader />
        <NavigationBar />
      </div>
      <div className="flex flex-col min-h-screen">
        {children}
        <Footer />
      </div>
    </>
  );
}

