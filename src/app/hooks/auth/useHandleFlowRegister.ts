import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerSchema, emailSchema, passwordSchema } from '@/app/schemas/auth.schema';
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

export const useHandleFlowRegister = () => {
    const router = useRouter(); 
    const { register, registerWithGoogle,  } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    const [isEmailExpanded, setIsEmailExpanded] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const validationResult = registerSchema.safeParse({ email, password, confirmPassword });
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

            const registerResult = await register(email, password);
            if (registerResult.success) {
                toast.success(registerResult.message || '¡Cuenta creada exitosamente!');
                toast.info('Te hemos enviado un email de verificación. Por favor, verifica tu email antes de continuar.');
                router.push('/register/verify-email');
            } else {
                toast.error(registerResult.message || 'Error al crear la cuenta');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Error al crear la cuenta');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setLoading(true);
        try {
            const result = await registerWithGoogle();
            if (result.success) {
                toast.success(result.message || '¡Cuenta creada exitosamente!');

                if (result.estado === 2) {
                    window.location.href = '/register/complete-perfil';
                } else {
                    router.push('/');
                }
            } else {
                toast.error(result.message || 'Error al registrarse con Google');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Error al registrarse con Google');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (errors.email) {
            const result = emailSchema.safeParse(value);
            if (result.success) {
                setErrors((prev) => ({ ...prev, email: undefined }));
            } else {
                setErrors((prev) => ({ ...prev, email: result.error.issues[0]?.message }));
            }
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        if (errors.password) {
            const result = passwordSchema.safeParse(value);
            if (result.success) {
                setErrors((prev) => ({ ...prev, password: undefined }));
            } else {
                setErrors((prev) => ({ ...prev, password: result.error.issues[0]?.message }));
            }
        }
        if (confirmPassword && errors.confirmPassword) {
            if (value === confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (errors.confirmPassword || password) {
            if (value === password) {
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            } else if (value) {
                setErrors((prev) => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
            }
        }
    };

    return {
        email,
        password,
        confirmPassword,
        loading,
        errors,
        isEmailExpanded,
        handleSubmit,
        handleGoogleRegister,
        handleEmailChange,
        handlePasswordChange,
        handleConfirmPasswordChange,
        setIsEmailExpanded,
    }
}