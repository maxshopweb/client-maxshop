import { UserRole } from './user';

export interface BackendAuthenticatedUser {
  id: string;
  nombre: string | null;
  apellido: string | null;
  email: string | null;
  telefono: string | null;
  username: string | null;
  img: string | null;
  nacimiento: string | null;
  rol: UserRole | null;
  ultimoLogin: string | null;
  loginIp: string | null;
  estado: number | null;
}

export interface BackendAuthOperationResult {
  estado?: number | null;
  user: BackendAuthenticatedUser;
  created: boolean;
  roleId: number | null;
}

export interface BackendAuthResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

