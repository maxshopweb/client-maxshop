import axios from 'axios';
import { User } from 'firebase/auth';
import AuthService from './auth.service';
import axiosInstance from '../lib/axios';
import { auth } from '../lib/firebase.config';
import { BackendAuthOperationResult, BackendAuthenticatedUser, BackendAuthResponse } from '../types/auth';
import { IUsuario, UserRole } from '../types/user';

type CombinedAuthData = {
  firebaseUser: User | null;
  firebaseToken: string;
  backend: BackendAuthOperationResult;
  usuario: IUsuario;
};

type CombinedAuthResult = {
  success: boolean;
  data: CombinedAuthData | null;
  error: string | null;
  message?: string | null;
  needsTokenRefresh?: boolean;
};

export type RegisterProfileInput = {
  nombre: string;
  apellido?: string | null;
  telefono?: string | null;
  nacimiento?: Date | null;
};

class AuthIntegrationService {
  private mapBackendUserToUsuario(backendUser: BackendAuthenticatedUser, estado?: number | null): IUsuario {
    // Validar que el estado sea un valor válido de UserEstado (0, 1, 2, 3) o null
    const validEstado = estado !== null && estado !== undefined && [0, 1, 2, 3].includes(estado) 
      ? (estado as 0 | 1 | 2 | 3) 
      : null;
    
    return {
      uid: backendUser.id,
      username: backendUser.username ?? backendUser.email?.split('@')[0] ?? backendUser.id,
      nombre: backendUser.nombre ?? backendUser.email ?? backendUser.id,
      apellido: backendUser.apellido ?? null,
      email: backendUser.email ?? '',
      telefono: backendUser.telefono ?? null,
      nacimiento: backendUser.nacimiento ? new Date(backendUser.nacimiento) : null,
      img: backendUser.img ?? null,
      rol: backendUser.rol ?? 'USER',
      estado: validEstado
    };
  }

  private extractErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error)) {
      return (error.response?.data as { error?: string })?.error ?? error.message ?? fallback;
    }
    if (error instanceof Error) {
      return error.message || fallback;
    }
    return fallback;
  }

  private async postAuthEndpoint(
    path: string,
    token: string,
    payload?: Record<string, unknown>
  ): Promise<{ data: BackendAuthOperationResult; message?: string }> {
    const body = payload ?? { idToken: token };
    const response = await axiosInstance.post<BackendAuthResponse<BackendAuthOperationResult>>(path, body, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.data?.success) {
      throw new Error(response.data?.error ?? 'Error en la sincronización con el backend.');
    }

    return {
      data: response.data.data,
      message: response.data.message
    };
  }

  // LOGIN: Verifica email, si está verificado sincroniza con backend
  async login(email: string, password: string): Promise<CombinedAuthResult> {
    const firebaseResult = await AuthService.login(email, password);
    if (!firebaseResult.success || !firebaseResult.data) {
      return {
        success: false,
        data: null,
        error: firebaseResult.error ?? 'No se pudo iniciar sesión.'
      };
    }

    const { user: firebaseUser, token } = firebaseResult.data;

    // Verificar email
    if (!firebaseUser.emailVerified) {
      await AuthService.logout();
      return {
        success: false,
        data: null,
        error: 'Debes verificar tu email antes de continuar. Revisa tu bandeja de entrada.'
      };
    }

    // Sincronizar con backend
    try {
      const { data: backendResult, message } = await this.postAuthEndpoint('/auth/login/token', token, { idToken: token });
      const usuario = this.mapBackendUserToUsuario(backendResult.user, backendResult.estado);

      return {
        success: true,
        data: { firebaseUser, firebaseToken: token, backend: backendResult, usuario },
        error: null,
        message: message ?? null
      };
    } catch (error) {
      await AuthService.logout();
      return {
        success: false,
        data: null,
        error: this.extractErrorMessage(error, 'Error al sincronizar con el backend.')
      };
    }
  }

  // LOGIN CON GOOGLE: Google ya verifica el email automáticamente
  async loginWithGoogle(): Promise<CombinedAuthResult> {
    const firebaseResult = await AuthService.loginWithGoogle();
    if (!firebaseResult.success || !firebaseResult.data) {
      return {
        success: false,
        data: null,
        error: firebaseResult.error ?? 'No se pudo iniciar sesión con Google.'
      };
    }

    const { user: firebaseUser, token } = firebaseResult.data;

    // Sincronizar con backend (Google ya verifica el email)
    try {
      const { data: backendResult, message } = await this.postAuthEndpoint('/auth/login/token', token, { idToken: token });
      const usuario = this.mapBackendUserToUsuario(backendResult.user, backendResult.estado);

      return {
        success: true,
        data: { firebaseUser, firebaseToken: token, backend: backendResult, usuario },
        error: null,
        message: message ?? null
      };
    } catch (error) {
      await AuthService.logout();
      return {
        success: false,
        data: null,
        error: this.extractErrorMessage(error, 'Error al sincronizar con el backend.')
      };
    }
  }

  // REGISTER: Crea en Firebase y registra en backend (estado inicial sin verificar)
  async register(email: string, password: string): Promise<CombinedAuthResult> {
    const firebaseResult = await AuthService.register(email, password);
    if (!firebaseResult.success || !firebaseResult.data) {
      return {
        success: false,
        data: null,
        error: firebaseResult.error ?? 'No se pudo registrar.'
      };
    }

    const { user: firebaseUser, token } = firebaseResult.data;

    // Registrar en backend (sin verificar aún)
    try {
      const registerPayload = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        username: firebaseUser.email?.split('@')[0] ?? firebaseUser.uid
      };

      const { data: backendResult, message } = await this.postAuthEndpoint('/auth/register', token, {
        idToken: token,
        data: registerPayload
      });
      const usuario = this.mapBackendUserToUsuario(backendResult.user, backendResult.estado);

      return {
        success: true,
        data: { firebaseUser, firebaseToken: token, backend: backendResult, usuario },
        error: null,
        message: message ?? null
      };
    } catch (error) {
      await firebaseUser.delete();
      return {
        success: false,
        data: null,
        error: this.extractErrorMessage(error, 'Error al registrar en el backend.')
      };
    }
  }

  // REGISTER CON GOOGLE: Google ya verifica el email, registra en backend con estado 2
  async registerWithGoogle(): Promise<CombinedAuthResult> {
    const firebaseResult = await AuthService.registerWithGoogle();
    if (!firebaseResult.success || !firebaseResult.data) {
      return {
        success: false,
        data: null,
        error: firebaseResult.error ?? 'No se pudo registrar con Google.'
      };
    }

    const { user: firebaseUser, token } = firebaseResult.data;
    const email = firebaseUser.email;

    if (!email) {
      await AuthService.logout();
      return {
        success: false,
        data: null,
        error: 'No se pudo obtener el email de Google.'
      };
    }

    // Registrar en backend (Google ya verifica el email, así que estado 2)
    try {
      const registerPayload = {
        uid: firebaseUser.uid,
        email,
        username: email.split('@')[0]
      };

      const { data: backendResult, message } = await this.postAuthEndpoint('/auth/register', token, {
        idToken: token,
        data: registerPayload
      });
      const usuario = this.mapBackendUserToUsuario(backendResult.user, backendResult.estado);

      return {
        success: true,
        data: { firebaseUser, firebaseToken: token, backend: backendResult, usuario },
        error: null,
        message: message ?? null
      };
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error, 'Error al registrar con Google.');
      // Si el email ya existe, no cerrar sesión (usuario puede hacer login)
      if (!errorMessage.includes('ya está registrado')) {
        await AuthService.logout();
      }
      return {
        success: false,
        data: null,
        error: errorMessage
      };
    }
  }

  // COMPLETAR PERFIL: Cambia estado de 2 a 3
  async completeProfile(profile: RegisterProfileInput, fallbackToken?: string | null): Promise<CombinedAuthResult> {
    let currentUser = auth.currentUser;
    let token: string | null = null;

    // Intentar obtener el token del usuario de Firebase
    if (currentUser) {
      try {
        token = await currentUser.getIdToken();
      } catch (error) {
        console.warn('Error al obtener token de Firebase:', error);
      }
    }

    // Si no hay token y se proporciona uno de respaldo, usarlo
    if (!token && fallbackToken) {
      token = fallbackToken;
    }

    // Si aún no hay token, esperar un poco y reintentar
    if (!token) {
      await new Promise(resolve => setTimeout(resolve, 500));
      currentUser = auth.currentUser;
      if (currentUser) {
        try {
          token = await currentUser.getIdToken();
        } catch (error) {
          console.warn('Error al obtener token después de esperar:', error);
        }
      }
    }

    if (!token) {
      return {
        success: false,
        data: null,
        error: 'No hay usuario autenticado. Debe iniciar sesión primero.'
      };
    }

    try {
      const profilePayload = {
        nombre: profile.nombre,
        apellido: profile.apellido ?? null,
        telefono: profile.telefono ?? null,
        nacimiento: profile.nacimiento ?? null
      };

      const { data: backendResult, message } = await this.postAuthEndpoint('/auth/complete-profile', token, {
        idToken: token,
        data: profilePayload
      });
      const usuario = this.mapBackendUserToUsuario(backendResult.user, backendResult.estado);

      // Intentar obtener el usuario de Firebase, pero si no está disponible, usar el token que tenemos
      let finalFirebaseUser = currentUser || auth.currentUser;
      
      // Si no hay usuario de Firebase pero el backend respondió exitosamente, 
      // el perfil se completó correctamente, así que retornar éxito
      // El AuthContext se encargará de sincronizar el usuario después
      if (!finalFirebaseUser) {
        // Esperar un poco más y reintentar
        await new Promise(resolve => setTimeout(resolve, 500));
        finalFirebaseUser = auth.currentUser;
      }

      return {
        success: true,
        data: {
          firebaseUser: finalFirebaseUser, // Puede ser null, pero el backend completó el perfil
          firebaseToken: token,
          backend: backendResult,
          usuario
        },
        error: null,
        message: message ?? null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: this.extractErrorMessage(error, 'Error al completar el perfil.')
      };
    }
  }

  // SINCRONIZAR USUARIO ACTUAL
  async syncCurrentUser(): Promise<CombinedAuthResult> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return {
        success: false,
        data: null,
        error: 'No hay usuario autenticado.'
      };
    }

    try {
      const token = await currentUser.getIdToken();
      const response = await axiosInstance.get<BackendAuthResponse<{ user: BackendAuthenticatedUser | null; needsTokenRefresh?: boolean }>>('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.data?.success || !response.data.data.user) {
        return {
          success: false,
          data: null,
          error: 'No se pudo obtener el usuario del backend.'
        };
      }

      // Mapear el usuario con el estado del backend (importante preservar el estado)
      const backendUser = response.data.data.user;
      const usuario = this.mapBackendUserToUsuario(backendUser, backendUser.estado ?? null);

      return {
        success: true,
        data: {
          firebaseUser: currentUser,
          firebaseToken: token,
          backend: {
            user: backendUser,
            estado: backendUser.estado ?? null,
            created: false,
            roleId: null
          },
          usuario
        },
        error: null,
        needsTokenRefresh: response.data.data.needsTokenRefresh ?? false
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: this.extractErrorMessage(error, 'No se pudo sincronizar la sesión.')
      };
    }
  }
}

export default new AuthIntegrationService();
