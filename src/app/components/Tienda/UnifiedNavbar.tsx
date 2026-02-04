"use client";

import { usePathname } from "next/navigation";
import CartSidebar from "@/app/components/cart/CartSidebar";
import LocationModal from "@/app/components/modals/LocationModal";
import { MENU_LINKS } from "@/app/components/navbar/navbar.constants";
import { useNavbarScroll } from "@/app/components/navbar/hooks/useNavbarScroll";
import { useNavbarAuth } from "@/app/components/navbar/hooks/useNavbarAuth";
import { useNavbarSearch } from "@/app/components/navbar/hooks/useNavbarSearch";
import { useNavbarLocation } from "@/app/components/navbar/hooks/useNavbarLocation";
import { useNavbarMobileMenu } from "@/app/components/navbar/hooks/useNavbarMobileMenu";
import { useNavbarCart } from "@/app/components/navbar/hooks/useNavbarCart";
import { useProductos } from "@/app/hooks/productos/useProductos";
import NavbarHeader from "@/app/components/navbar/desktop/NavbarHeader";
import NavbarLogo from "@/app/components/navbar/desktop/NavbarLogo";
import NavbarSearchBar from "@/app/components/navbar/desktop/NavbarSearchBar";
import NavbarUserActions from "@/app/components/navbar/desktop/NavbarUserActions";
import NavbarLocationIndicator from "@/app/components/navbar/desktop/NavbarLocationIndicator";
import NavbarDesktopMenu from "@/app/components/navbar/desktop/NavbarDesktopMenu";
import MobileMenuOverlay from "@/app/components/navbar/mobile/MobileMenuOverlay";
import MobileMenuHeader from "@/app/components/navbar/mobile/MobileMenuHeader";
import MobileMenuSearch from "@/app/components/navbar/mobile/MobileMenuSearch";
import MobileMenuLinks from "@/app/components/navbar/mobile/MobileMenuLinks";
import MobileMenuFooter from "@/app/components/navbar/mobile/MobileMenuFooter";
import MobileLocationButton from "@/app/components/navbar/mobile/MobileLocationButton";
import NavbarSearchContainer from "@/app/components/search/NavbarSearchContainer";

export default function UnifiedNavbar() {
  const pathname = usePathname();
  const actualTheme = "light";

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
  
  // Obtener productos para la búsqueda
  const { productos } = useProductos({
    filters: { limit: 1000 },
    enabled: true,
  });

  const handleLocationClick = () => {
    openLocationModal();
  };

  const handleMobileLocationClick = () => {
    openLocationModal();
    closeMobileMenu();
  };

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* Parte Superior: Logo, Toggle, User, Cart */}
        <NavbarHeader shouldShowBackground={shouldShowBackground}>
          <NavbarLogo pathname={pathname || ''} />
          <div className="hidden md:block flex-1">
            <NavbarSearchContainer
              products={productos || []}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
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
                localidad={localidad}
                shouldShowBackground={shouldShowBackground}
                actualTheme={actualTheme}
                onLocationClick={handleLocationClick}
              />

              <NavbarDesktopMenu
                links={MENU_LINKS}
                pathname={pathname || ''}
                shouldShowBackground={shouldShowBackground}
                actualTheme={actualTheme}
              />
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
          localidad={localidad}
          onClick={handleMobileLocationClick}
        />

        <NavbarSearchContainer
          products={productos || []}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        >
          <MobileMenuSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </NavbarSearchContainer>

        <MobileMenuLinks
          links={MENU_LINKS}
          pathname={pathname || ''}
          isOpen={isMobileMenuOpen}
          onLinkClick={closeMobileMenu}
        />

        <MobileMenuFooter
          isAuthenticated={isAuthenticated}
          onClose={closeMobileMenu}
          onLogout={logout}
        />
      </MobileMenuOverlay>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={closeLocationModal}
        onLocationSelect={handleLocationSelect}
        currentProvincia={selectedProvincia}
        currentCiudad={selectedCiudad}
      />
    </>
  );
}
