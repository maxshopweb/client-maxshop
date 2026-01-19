import ProductsPageClient from "../../../components/product/ProductsPageClient";

export const dynamic = 'force-dynamic';

export default function ProductosPage() {
  // Los productos ahora se obtienen en el cliente usando useProductos
  // Esto permite mejor control de paginación, filtros y estado de carga
  return <ProductsPageClient />;
}
