import { Metadata } from "next";
import ProductPageClient from "./ProductPageClient";
import { IProductos } from "@/app/types/producto.type";
import { resolveProductImageUrl } from "@/app/lib/upload";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

function ogImageFromProducto(producto: IProductos): string {
  const main = resolveProductImageUrl(producto.img_principal);
  if (main) return main;

  if (producto.imagenes && Array.isArray(producto.imagenes)) {
    for (const img of producto.imagenes) {
      const url = resolveProductImageUrl(typeof img === "string" ? img : null);
      if (url) return url;
    }
  }

  return "";
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return {
      title: "Productos",
      description: "Comprá los mejores productos en MaxShop",
    };
  }

  const { data: producto } = await res.json() as { data: IProductos };
  const name = producto.nombre?.trim() || "Producto";
  const displayTitle = `${name} | MaxShop`;
  const description =
    producto.descripcion?.trim() || `Comprá ${name} en MaxShop`;
  const imageUrl = ogImageFromProducto(producto);
  const images = imageUrl ? [{ url: imageUrl, alt: name }] : undefined;

  return {
    title: name,
    description,
    alternates: {
      canonical: `/tienda/productos/${id}`,
    },
    openGraph: {
      title: displayTitle,
      description: producto.descripcion?.trim() || description,
      url: `/tienda/productos/${id}`,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description: producto.descripcion?.trim() || description,
      images: images?.map((i) => i.url),
    },
  };
}

export default function ProductPage() {
  return <ProductPageClient />;
}
