import { z } from 'zod';

// Schema para email
export const emailSchema = z
  .string()
  .min(1, 'El email es requerido')
  .email('El email no es válido');

// Schema para contraseña con todos los requisitos
export const passwordSchema = z
  .string()
  .min(1, 'La contraseña es requerida')
  .min(6, 'La contraseña debe tener al menos 6 caracteres')
  .regex(/\d/, 'La contraseña debe contener al menos un número')
  .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
  .regex(/[a-z]/, 'La contraseña debe contener al menos una minúscula')
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    'La contraseña debe contener al menos un carácter especial'
  );

// Schema para login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Schema para registro
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

// Schema para completar perfil (Step 2)
export const completeProfileSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  apellido: z.string().max(100, 'Máximo 100 caracteres').optional().nullable(),
  telefono: z.string().optional().nullable(),
  nacimiento: z.string().optional().nullable(),
});

// Tipos inferidos
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

