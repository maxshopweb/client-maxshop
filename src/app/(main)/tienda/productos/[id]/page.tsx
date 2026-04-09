import { Metadata } from "next";
import ProductPageClient from "./ProductPageClient";
import { IProductos } from "@/app/types/producto.type";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return {
      title: "Productos",
      description: "Comprá los mejores productos en MaxShop",
    };
  }

  const { data: producto } = await res.json() as { data: IProductos };

  return {
    title: `${producto.nombre} | MaxShop`,
    description: producto.descripcion ?? `Comprá ${producto.nombre} en MaxShop`,
    openGraph: {
      title: `${producto.nombre} | MaxShop`,
      description: producto.descripcion ?? "",
      images: producto.img_principal ? [{ url: producto.img_principal }] : producto.imagenes?.[0]?.[0] ? [{ url: producto.imagenes[0][0] }] : [],
    },
  };
}

export default function ProductPage() {
  return <ProductPageClient />
}