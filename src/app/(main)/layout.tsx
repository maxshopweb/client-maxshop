import UnifiedNavbar from "@/app/components/Tienda/UnifiedNavbar";
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
      
      {/* Navbar Unificado */}
      <div className="sticky top-10 z-50">
        <UnifiedNavbar />
      </div>
      <div className="flex flex-col min-h-screen">
        {children}
        <Footer />
      </div>
    </>
  );
}

