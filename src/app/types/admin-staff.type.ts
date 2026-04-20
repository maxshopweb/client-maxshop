/** Usuario de staff expuesto por la API (sin contraseña). */
export interface IStaffUser {
  id_usuario: string;
  nombre: string | null;
  apellido: string | null;
  email: string | null;
  username: string | null;
  activo: boolean | null;
  rol: string | null;
  id_rol: number | null;
  estado: number | null;
}

export interface IStaffListParams {
  page?: number;
  limit?: number;
  search?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: 'ADMIN' | 'USER';
  activo?: boolean;
}

export interface IStaffListResult {
  data: IStaffUser[];
  total: number;
  page: number;
  limit: number;
}

export interface IStaffCreateInput {
  email: string;
  nombre: string;
  apellido?: string | null;
  /** Si no se envía, el backend genera la contraseña. */
  password?: string;
}

export interface IStaffCreateResult {
  user: IStaffUser;
  temporaryPassword: string;
}

export interface IStaffUpdateInput {
  nombre?: string;
  apellido?: string | null;
  email?: string;
  rol?: 'ADMIN' | 'USER';
}

export interface IStaffResetPasswordResult {
  temporaryPassword: string;
}

export interface IApiStaffResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
