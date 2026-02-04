export type UserRole = 'ADMIN' | 'USER';

// 1 = activo, 2 = inactivo, 0 = eliminado, 3 = perfil incompleto
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
}