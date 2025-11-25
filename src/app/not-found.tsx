"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 font-fredoka">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Ilustración/Icono */}
        <div className="flex justify-center">
          <div className="relative">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center text-6xl font-bold"
              style={{
                backgroundColor: "rgba(var(--principal-rgb), 0.1)",
                color: "var(--principal)",
              }}
            >
              404
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-principal flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Mensaje */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Página no encontrada
          </h1>
          <p className="text-lg md:text-xl text-foreground/70">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <p className="text-sm text-foreground/60">
            Puede que el enlace esté roto o que hayas escrito mal la dirección.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver atrás
          </Button>
          <Link href="/">
            <Button
              variant="outline-primary"
              size="lg"
              className="flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Ir al inicio
            </Button>
          </Link>
        </div>

        {/* Enlaces útiles */}
        <div className="pt-8 border-t border-input/20">
          <p className="text-sm text-foreground/60 mb-4">
            O puedes visitar:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/tienda/productos"
              className="text-sm text-principal hover:text-principal/80 transition-colors underline"
            >
              Ver productos
            </Link>
            <Link
              href="/"
              className="text-sm text-principal hover:text-principal/80 transition-colors underline"
            >
              Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

