"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useProduct } from "@/app/hooks/productos/useProduct";
import { useRelatedProducts } from "@/app/hooks/productos/useRelatedProducts";
import ProductGallery from "@/app/components/product/ProductGallery";
import ProductInfo from "@/app/components/product/ProductInfo";
import AddToCartSection from "@/app/components/product/AddToCartSection";
import ProductTabs from "@/app/components/product/ProductTabs";
import RelatedProducts from "@/app/components/product/RelatedProducts";
import ProductBreadcrumbs from "@/app/components/product/ProductBreadcrumbs";
import ProductPageSkeleton from "@/app/components/product/ProductPageSkeleton";
import { Button } from "@/app/components/ui/Button";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string, 10);

  const {
    data: producto,
    isLoading,
    isError,
    error,
  } = useProduct(productId);

  const {
    data: relatedProducts,
    isLoading: isLoadingRelated,
  } = useRelatedProducts(productId, 5);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 pt-16 sm:pt-20">
        <ProductPageSkeleton />
      </div>
    );
  }

  // Error state
  if (isError || !producto) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-16 pt-16 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center space-y-6"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Producto no encontrado
            </h1>
            <p className="text-foreground/70 mb-6">
              {error instanceof Error
                ? error.message
                : "El producto que buscas no existe o ha sido eliminado."}
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => router.back()}
              variant="outline-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <Button
              onClick={() => router.push("/tienda")}
              variant="primary"
            >
              Ir a la Tienda
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Verificar si el producto está activo
  const isActive = producto.activo === "S" || producto.estado === 1;
  if (!isActive && producto.stock === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-16 pt-16 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center space-y-6"
        >
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Producto no disponible
            </h1>
            <p className="text-foreground/70 mb-6">
              Este producto no está disponible actualmente.
            </p>
          </div>
          <Button
            onClick={() => router.push("/tienda")}
            variant="primary"
          >
            Ver otros productos
          </Button>
        </motion.div>
      </div>
    );
  }

  // Main content
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 pt-16 sm:pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Breadcrumbs */}
          <ProductBreadcrumbs producto={producto} />

          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductGallery producto={producto} />
            </motion.div>

            {/* Info and Add to Cart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 sm:space-y-6"
            >
              <ProductInfo producto={producto} />
              <AddToCartSection producto={producto} />
            </motion.div>
          </div>

          {/* Tabs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-4 sm:pt-6"
          >
            <ProductTabs producto={producto} />
          </motion.div>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-4 sm:pt-6"
            >
              <RelatedProducts
                productos={relatedProducts}
                isLoading={isLoadingRelated}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
  );
}

