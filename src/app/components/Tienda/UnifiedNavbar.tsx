"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import CartSidebar from "@/app/components/cart/CartSidebar";
import LocationModal from "@/app/components/modals/LocationModal";
import { MENU_LINKS } from "@/app/components/navbar/navbar.constants";
import { useNavbarScroll } from "@/app/components/navbar/hooks/useNavbarScroll";
import { useNavbarAuth } from "@/app/components/navbar/hooks/useNavbarAuth";
import { useNavbarSearch } from "@/app/components/navbar/hooks/useNavbarSearch";
import { useNavbarLocation } from "@/app/components/navbar/hooks/useNavbarLocation";
import { useNavbarMobileMenu } from "@/app/components/navbar/hooks/useNavbarMobileMenu";
import { useHashScrollOnHome } from "@/app/components/navbar/hooks/useHashScrollOnHome";
import { useNavbarCart } from "@/app/components/navbar/hooks/useNavbarCart";
import { useProductos } from "@/app/hooks/productos/useProductos";
import NavbarHeader from "@/app/components/navbar/desktop/NavbarHeader";
import NavbarLogo from "@/app/components/navbar/desktop/NavbarLogo";
import NavbarSearchBar from "@/app/components/navbar/desktop/NavbarSearchBar";
import NavbarUserActions from "@/app/components/navbar/desktop/NavbarUserActions";
import NavbarLocationIndicator from "@/app/components/navbar/desktop/NavbarLocationIndicator";
import NavbarFiltersMegaMenu from "@/app/components/navbar/desktop/NavbarFiltersMegaMenu";
import NavbarDesktopMenu from "@/app/components/navbar/desktop/NavbarDesktopMenu";
import MobileMenuOverlay from "@/app/components/navbar/mobile/MobileMenuOverlay";
import MobileMenuHeader from "@/app/components/navbar/mobile/MobileMenuHeader";
import MobileMenuSearch from "@/app/components/navbar/mobile/MobileMenuSearch";
import MobileMenuLinks from "@/app/components/navbar/mobile/MobileMenuLinks";
import MobileFiltersMenu from "@/app/components/navbar/mobile/MobileFiltersMenu";
import MobileMenuFooter from "@/app/components/navbar/mobile/MobileMenuFooter";
import MobileLocationButton from "@/app/components/navbar/mobile/MobileLocationButton";
import NavbarSearchContainer from "@/app/components/search/NavbarSearchContainer";

export default function UnifiedNavbar() {
  const pathname = usePathname();
  const actualTheme = "light" as "light" | "dark";
  const primaryMenuLinks = MENU_LINKS.filter(
    (link) => link.href === "/" || link.href === "/tienda/productos"
  );
  const secondaryMenuLinks = MENU_LINKS.filter(
    (link) => link.href !== "/" && link.href !== "/tienda/productos"
  );

  // Hooks
  const { shouldShowBackground } = useNavbarScroll();
  const { user, isAuthenticated, loginUrl, logout } = useNavbarAuth();
  const { searchQuery, setSearchQuery } = useNavbarSearch();
  const {
    localidad,
    selectedProvincia,
    selectedCiudad,
    isLocationModalOpen,
    openLocationModal,
    closeLocationModal,
    handleLocationSelect,
  } = useNavbarLocation();
  const { isOpen: isMobileMenuOpen, toggle: toggleMobileMenu, close: closeMobileMenu } = useNavbarMobileMenu();
  const { cantidadItems, openCart, closeCart, isCartOpen } = useNavbarCart();
  const [mobileMenuView, setMobileMenuView] = useState<"menu" | "filters">("menu");

  useHashScrollOnHome();

  // Cargar productos para la búsqueda solo cuando el usuario usa el buscador (evita /productos?limit=100 en cada página)
  const searchActive = (searchQuery?.trim().length ?? 0) >= 1;
  const { productos, isLoading: isLoadingProductos } = useProductos({
    filters: { limit: 1000 },
    enabled: searchActive,
  });

  const handleLocationClick = () => {
    openLocationModal();
  };

  const handleMobileLocationClick = () => {
    openLocationModal();
    closeMobileMenu();
  };

  useEffect(() => {
    if (!isMobileMenuOpen) {
      setMobileMenuView("menu");
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-10 left-0 right-0 z-50">
        {/* Parte Superior: Logo, Toggle, User, Cart */}
        <NavbarHeader shouldShowBackground={shouldShowBackground}>
          <NavbarLogo pathname={pathname || ''} />
          <div className="hidden md:block flex-1">
            <NavbarSearchContainer
              products={productos || []}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isLoading={isLoadingProductos}
            >
              <NavbarSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            </NavbarSearchContainer>
          </div>
          <NavbarUserActions
            isAuthenticated={isAuthenticated}
            loginUrl={loginUrl}
            user={user}
            cantidadItems={cantidadItems}
            isMobileMenuOpen={isMobileMenuOpen}
            onCartClick={openCart}
            onMobileMenuToggle={toggleMobileMenu}
          />
        </NavbarHeader>

        {/* Parte Inferior: Localidad + Links del Menú - Solo Desktop */}
        <nav
          className={`hidden md:block transition-all duration-500 ${
            shouldShowBackground
              ? actualTheme === 'dark'
                ? "shadow-md bg-secundario text-white"
                : "shadow-md bg-white text-terciario"
              : "bg-transparent"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-12 md:h-14">
              <NavbarLocationIndicator
                shouldShowBackground={shouldShowBackground}
                actualTheme={actualTheme}
                onLocationClick={handleLocationClick}
              />

              <div className="flex items-center gap-4 lg:gap-6">
                <NavbarDesktopMenu
                  links={primaryMenuLinks}
                  pathname={pathname || ''}
                  shouldShowBackground={shouldShowBackground}
                  actualTheme={actualTheme}
                />
                <Suspense fallback={null}>
                  <NavbarFiltersMegaMenu
                    shouldShowBackground={shouldShowBackground}
                    actualTheme={actualTheme}
                    triggerLabel="Categorías"
                  />
                </Suspense>
                <NavbarDesktopMenu
                  links={secondaryMenuLinks}
                  pathname={pathname || ''}
                  shouldShowBackground={shouldShowBackground}
                  actualTheme={actualTheme}
                />
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClose={closeMobileMenu}>
        <MobileMenuHeader
          isAuthenticated={isAuthenticated}
          user={user}
          loginUrl={loginUrl}
          onClose={closeMobileMenu}
          onLoginClick={closeMobileMenu}
        />

        <MobileLocationButton
          onClick={handleMobileLocationClick}
        />

        <NavbarSearchContainer
          products={productos || []}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isLoading={isLoadingProductos}
        >
          <MobileMenuSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </NavbarSearchContainer>

        <MobileMenuLinks
          links={MENU_LINKS}
          pathname={pathname || ''}
          isOpen={isMobileMenuOpen}
          onLinkClick={closeMobileMenu}
          onOpenFilters={() => setMobileMenuView("filters")}
        />

        <MobileMenuFooter
          isAuthenticated={isAuthenticated}
          onClose={closeMobileMenu}
          onLogout={logout}
        />

        {mobileMenuView === "filters" && (
          <Suspense fallback={null}>
            <MobileFiltersMenu
              onBack={() => setMobileMenuView("menu")}
              onApply={closeMobileMenu}
            />
          </Suspense>
        )}
      </MobileMenuOverlay>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={closeLocationModal}
        onLocationSelect={handleLocationSelect}
      />
    </>
  );
}
