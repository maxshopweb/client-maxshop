"use client";

import { Component, ReactNode } from "react";
import ProfileCard from "./ProfileCard";
import { Package, XCircle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class OrdersSectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error en OrdersSection:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ProfileCard title="Mis pedidos" icon={Package}>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <XCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Error al cargar pedidos
            </h3>
            <p className="text-sm text-foreground/60 mb-4">
              {this.state.error?.message || "Ocurrió un error al cargar tus pedidos"}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </ProfileCard>
      );
    }

    return this.props.children;
  }
}

