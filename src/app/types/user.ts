export type UserRole = 'ADMIN' | 'USER';

// 0 = eliminado, 1 = invitado (checkout sin registro), 2 = perfil incompleto, 3 = dado de alta (usuario completo)
export type UserEstado = 0 | 1 | 2 | 3;

export interface IUsuario {
  uid: string;
  username: string;
  nombre: string;
  apellido?: string | null;
  email: string;
  telefono: string | null;
  nacimiento: Date | null;
  img: string | null;
  rol: UserRole;
  estado?: UserEstado | null;
  /** Si false, no puede iniciar sesión ni realizar compras (cuenta suspendida) */
  activo?: boolean | null;
  numero_documento?: string | null;
  tipo_documento?: string | null;
  creado_en?: Date | string | null;
  ultimo_login?: Date | string | null;
}

/** Alias usado en cliente/venta */
export type IUsuarios = IUsuario;