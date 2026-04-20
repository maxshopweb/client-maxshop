import axiosInstance from '@/app/lib/axios';
import { getClientErrorMessage } from '@/app/utils/apiError';
import type {
  IApiStaffResponse,
  IStaffCreateInput,
  IStaffCreateResult,
  IStaffListParams,
  IStaffListResult,
  IStaffResetPasswordResult,
  IStaffUpdateInput,
  IStaffUser
} from '@/app/types/admin-staff.type';

function assertSuccess<T>(
  res: { data: IApiStaffResponse<T> },
  fallback: string
): T {
  const body = res.data;
  if (!body.success || body.data === undefined) {
    throw new Error(body.error || fallback);
  }
  return body.data;
}

async function staffRequest<T>(fn: () => Promise<{ data: IApiStaffResponse<T> }>, fallback: string): Promise<T> {
  try {
    const res = await fn();
    return assertSuccess(res, fallback);
  } catch (e) {
    throw new Error(getClientErrorMessage(e, fallback));
  }
}

function buildListQuery(params: IStaffListParams): string {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set('page', String(params.page));
  if (params.limit != null) searchParams.set('limit', String(params.limit));
  if (params.search?.trim()) searchParams.set('search', params.search.trim());
  if (params.nombre?.trim()) searchParams.set('nombre', params.nombre.trim());
  if (params.apellido?.trim()) searchParams.set('apellido', params.apellido.trim());
  if (params.email?.trim()) searchParams.set('email', params.email.trim());
  if (params.rol) searchParams.set('rol', params.rol);
  if (params.activo !== undefined) {
    searchParams.set('activo', params.activo ? 'true' : 'false');
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

class AdminStaffService {
  list(params: IStaffListParams = {}): Promise<IStaffListResult> {
    const url = `/admin/staff${buildListQuery(params)}`;
    return staffRequest(() => axiosInstance.get<IApiStaffResponse<IStaffListResult>>(url), 'Error al listar el personal.');
  }

  getById(idUsuario: string): Promise<IStaffUser> {
    return staffRequest(
      () =>
        axiosInstance.get<IApiStaffResponse<IStaffUser>>(
          `/admin/staff/${encodeURIComponent(idUsuario)}`
        ),
      'Error al obtener el usuario.'
    );
  }

  create(input: IStaffCreateInput): Promise<IStaffCreateResult> {
    return staffRequest(
      () => axiosInstance.post<IApiStaffResponse<IStaffCreateResult>>('/admin/staff', input),
      'Error al crear el usuario.'
    );
  }

  update(idUsuario: string, input: IStaffUpdateInput): Promise<IStaffUser> {
    return staffRequest(
      () =>
        axiosInstance.patch<IApiStaffResponse<IStaffUser>>(
          `/admin/staff/${encodeURIComponent(idUsuario)}`,
          input
        ),
      'Error al actualizar el usuario.'
    );
  }

  resetPassword(idUsuario: string): Promise<IStaffResetPasswordResult> {
    return staffRequest(
      () =>
        axiosInstance.post<IApiStaffResponse<IStaffResetPasswordResult>>(
          `/admin/staff/${encodeURIComponent(idUsuario)}/reset-password`,
          {}
        ),
      'Error al reiniciar la contraseña.'
    );
  }

  setActive(idUsuario: string, activo: boolean): Promise<IStaffUser> {
    return staffRequest(
      () =>
        axiosInstance.patch<IApiStaffResponse<IStaffUser>>(
          `/admin/staff/${encodeURIComponent(idUsuario)}/active`,
          { activo }
        ),
      'Error al actualizar el estado.'
    );
  }
}

export const adminStaffService = new AdminStaffService();
