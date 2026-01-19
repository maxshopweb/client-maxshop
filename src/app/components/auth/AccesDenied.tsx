'use client';

import { OctagonAlert } from "lucide-react";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import { type UserRole } from "../../types/user";
import { useAuthGuard } from "../../hooks/auth/useAuthGuard";

type AccesDeniedProps = {
    role?: UserRole | null;
};

const AccesDenied = (props: AccesDeniedProps = {}) => {
    const { role: roleProp } = props;
    const router = useRouter();
    // Si no se pasa role como prop, intentar obtenerlo del hook
    const { role: roleFromHook } = useAuthGuard({ skipRedirect: true });
    const role = roleProp ?? roleFromHook;

    return (
        <div className="text-center px-4 w-full flex items-center justify-center flex-col">
            <div className="mb-6">
                <OctagonAlert className="w-24 h-24 text-principal" />
            </div>

            <h1 className="text-4xl font-bold text-secundario mb-4">
                Acceso denegado
            </h1>

            <p className="text-lg text-terciario/70 mb-8 max-w-md mx-auto">
                No tienes permisos para acceder a esta sección.
                {role && (
                    <span className="block mt-2 text-sm">
                        Tu rol actual: <span className="font-semibold text-terciario">{role}</span>
                    </span>
                )}
            </p>

            <div className="flex gap-4 justify-center">
                <Button
                    variant="primary"
                    onClick={() => router.back()}
                >
                    Volver
                </Button>

                <Button
                    variant="outline-primary"
                    onClick={() => router.push('/')}
                >
                    Ir al inicio
                </Button>
            </div>

            {role === 'ADMIN' && (
                <p className="mt-8 text-sm text-terciario/60">
                    Si crees que esto es un error, contacta al administrador del sistema.
                </p>
            )}
        </div>
    )
}

export default AccesDenied;
