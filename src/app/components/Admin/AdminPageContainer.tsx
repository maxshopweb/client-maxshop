'use client';

interface AdminPageContainerProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Contenedor estándar para páginas de admin.
 * Aplica el mismo padding y espaciado en todas las secciones.
 */
export function AdminPageContainer({ children, className = '' }: AdminPageContainerProps) {
    return (
        <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`.trim()}>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
}
