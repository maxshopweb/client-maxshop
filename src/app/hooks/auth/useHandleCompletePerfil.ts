import { useAuth } from "@/app/context/AuthContext";
import { completeProfileSchema } from "@/app/schemas/auth.schema";
import { useAuthStore } from "@/app/stores/userStore";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useHandleCompletePerfil = () => {
    const router = useRouter();
    const { completeProfile, user, role, firebaseUser, loading: authLoading, logout } = useAuth();

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [nacimiento, setNacimiento] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{
        nombre?: string;
        apellido?: string;
        telefono?: string;
        nacimiento?: string;
    }>({});

    const setFieldValue = (field: string, value: string) => {
        switch (field) {
            case 'nombre':
                setNombre(value);
                break;
            case 'apellido':
                setApellido(value);
                break;
            case 'telefono':
                setTelefono(value);
                break;
            case 'nacimiento':
                setNacimiento(value);
                break;
        }
        setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const validationResult = completeProfileSchema.safeParse({
                nombre,
                apellido: apellido || null,
                telefono: telefono || null,
                nacimiento: nacimiento || null,
            });

            if (!validationResult.success) {
                const fieldErrors: typeof errors = {};
                validationResult.error.issues.forEach((err) => {
                    const path = err.path[0] as keyof typeof fieldErrors;
                    if (path) fieldErrors[path] = err.message;
                });
                setErrors(fieldErrors);
                setLoading(false);
                return;
            }

            const result = await completeProfile({
                nombre: validationResult.data.nombre,
                apellido: validationResult.data.apellido ?? null,
                telefono: validationResult.data.telefono ?? undefined,
                nacimiento: validationResult.data.nacimiento ? new Date(validationResult.data.nacimiento) : undefined,
            });

            if (result.success) {
                toast.success(result.message || '¡Perfil completado exitosamente!');

                // Esperar un momento para que el store se actualice completamente
                // La persistencia de Zustand puede tomar un poco más de tiempo
                await new Promise(resolve => setTimeout(resolve, 500));

                // Verificar que el usuario esté actualizado en el store
                // Reintentar hasta 3 veces si no está actualizado
                let updatedUser = useAuthStore.getState().usuario;
                let attempts = 0;
                while (!updatedUser && attempts < 3) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                    updatedUser = useAuthStore.getState().usuario;
                    attempts++;
                }

                // Si aún no hay usuario en el store, usar el del contexto
                if (!updatedUser) {
                    updatedUser = user;
                }

                const updatedRole = updatedUser?.rol || role;

                // Redirigir según el rol usando replace para evitar que vuelva atrás
                if (updatedRole === 'ADMIN') {
                    router.replace('/admin/home');
                } else {
                    router.replace('/');
                }
            } else {
                toast.error(result.message || 'Error al completar el perfil');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Error al completar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setNombre('');
        setApellido('');
        setTelefono('');
        setNacimiento('');
        setErrors({});
    }

    const handleBackLogin = async () => {
        try {
            // Hacer logout (limpia Firebase, store y cookies)
            await logout();

            // Limpiar TODO el localStorage (excepto theme)
            if (typeof window !== 'undefined') {
                const theme = localStorage.getItem('theme');
                localStorage.clear();
                if (theme) {
                    localStorage.setItem('theme', theme);
                }

                // Limpiar sessionStorage
                sessionStorage.clear();
            }

            // Redirigir al login
            router.push('/login');
        } catch (error) {
            console.error('Error al hacer logout:', error);
            // Aunque haya error, limpiar storage y redirigir
            if (typeof window !== 'undefined') {
                const theme = localStorage.getItem('theme');
                localStorage.clear();
                if (theme) {
                    localStorage.setItem('theme', theme);
                }
                sessionStorage.clear();
            }
            router.push('/login');
        } finally {
            setLoading(false);
            handleClear();
        }
    }

    return {
        nombre,
        apellido,
        telefono,
        nacimiento,
        loading,
        errors,

        handleSubmit,
        setFieldValue,
        handleBackLogin
    }
}