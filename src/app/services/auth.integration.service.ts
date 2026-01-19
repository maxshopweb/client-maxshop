import axios from 'axios';
import { User } from 'firebase/auth';
import AuthService from './auth.service';
import EmailValidationService from './emailValidation.service';
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
      const errorMessage = response.data?.error ?? 'Error en la sincronización con el backend.';
      console.error(`❌ [postAuthEndpoint] ${path} - success: false`, { error: errorMessage, response: response.data });
      throw new Error(errorMessage);
    }

    if (!response.data?.data) {
      console.error(`❌ [postAuthEndpoint] ${path} - data es undefined`, { response: response.data });
      throw new Error('El backend no devolvió datos en la respuesta.');
    }

    // Verificar que data tenga la estructura correcta
    if (!response.data.data.user) {
      console.error(`❌ [postAuthEndpoint] ${path} - data.user es undefined`, { data: response.data.data });
      throw new Error('El backend no devolvió los datos del usuario en la respuesta.');
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
        // NO enviar idToken en el body, solo los datos del perfil
        // El token se envía en el header Authorization
        data: {
          nombre: profile.nombre,
          apellido: profile.apellido ?? null,
          telefono: profile.telefono ?? null,
          nacimiento: profile.nacimiento ?? null
        }
      };

      // El token se envía en el header Authorization, NO en el body
      const { data: backendResult, message } = await this.postAuthEndpoint('/auth/complete-profile', token, profilePayload);
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

  // SINCRONIZAR DESPUÉS DE VERIFICAR EMAIL: Usa login/token para actualizar estado
  async syncAfterEmailVerification(): Promise<CombinedAuthResult> {
    let currentUser = auth.currentUser;
    if (!currentUser) {
      return {
        success: false,
        data: null,
        error: 'No hay usuario autenticado.'
      };
    }

    try {
      // Forzar reload del usuario para obtener el estado más reciente
      console.log('[syncAfterEmailVerification] Recargando usuario de Firebase...');
      await currentUser.reload();
      currentUser = auth.currentUser;
      
      if (!currentUser) {
        return {
          success: false,
          data: null,
          error: 'No se pudo recargar el usuario de Firebase.'
        };
      }

      // Verificar que el email esté verificado antes de continuar
      if (!currentUser.emailVerified) {
        console.warn('[syncAfterEmailVerification] Email no está verificado aún después del reload');
        return {
          success: false,
          data: null,
          error: 'El email aún no está verificado.'
        };
      }

      // Forzar refresh del token para que tenga el estado actualizado de email verificado
      console.log('[syncAfterEmailVerification] Email verificado, refrescando token...');
      const token = await currentUser.getIdToken(true);
      console.log('[syncAfterEmailVerification] Token refrescado, llamando a /auth/login/token');
      
      // Usar login/token para actualizar el estado de null a 2
      const { data: backendResult, message } = await this.postAuthEndpoint('/auth/login/token', token, { idToken: token });
      console.log('[syncAfterEmailVerification] Respuesta del backend:', { estado: backendResult.estado, user: backendResult.user?.email });
      const usuario = this.mapBackendUserToUsuario(backendResult.user, backendResult.estado);

      return {
        success: true,
        data: {
          firebaseUser: currentUser,
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
        error: this.extractErrorMessage(error, 'No se pudo sincronizar después de verificar el email.')
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

      if (!response.data?.success || !response.data?.data?.user) {
        return {
          success: false,
          data: null,
          error: 'No se pudo obtener el usuario del backend.'
        };
      }

      // Mapear el usuario con el estado del backend (importante preservar el estado)
      // Después de la verificación, sabemos que response.data.data.user existe
      const backendUser = response.data.data!.user;
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
        needsTokenRefresh: response.data?.data?.needsTokenRefresh ?? false
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: this.extractErrorMessage(error, 'No se pudo sincronizar la sesión.')
      };
    }
  }

  // SIGN IN AS GUEST: Autenticación anónima para checkout
  async signInAsGuest(guestData: {
    email: string;
    nombre: string;
    apellido?: string;
    telefono?: string;
  }): Promise<CombinedAuthResult> {
    try {
      // 1. Verificar que el email no exista (o que sea un invitado previo)
      const emailCheck = await EmailValidationService.checkEmailExists(guestData.email);
      
      if (emailCheck.exists && !emailCheck.canLoginAsGuest) {
        return {
          success: false,
          data: null,
          error: 'Este email ya está registrado. ¿Deseas iniciar sesión?'
        };
      }

      // 2. Iniciar sesión anónima en Firebase
      const firebaseResult = await AuthService.signInAnonymously();
      if (!firebaseResult.success || !firebaseResult.data) {
        return {
          success: false,
          data: null,
          error: firebaseResult.error ?? 'No se pudo iniciar sesión como invitado.'
        };
      }

      const { user: firebaseUser, token } = firebaseResult.data;

      // 3. Registrar invitado en backend
      try {
        const { data: backendResult, message } = await this.postAuthEndpoint('/auth/guest-register', token, {
          idToken: token,
          email: guestData.email,
          nombre: guestData.nombre,
          apellido: guestData.apellido ?? null,
          telefono: guestData.telefono ?? null
        });

        // Verificar que backendResult y backendResult.user existan
        if (!backendResult) {
          console.error('❌ [signInAsGuest] backendResult es undefined');
          throw new Error('El backend no devolvió datos en la respuesta.');
        }

        if (!backendResult.user) {
          console.error('❌ [signInAsGuest] backendResult.user es undefined', { backendResult });
          throw new Error('El backend no devolvió los datos del usuario correctamente.');
        }

        const usuario = this.mapBackendUserToUsuario(backendResult.user, backendResult.estado);

        return {
          success: true,
          data: { firebaseUser, firebaseToken: token, backend: backendResult, usuario },
          error: null,
          message: message ?? null
        };
      } catch (error) {
        console.error('❌ [signInAsGuest] Error al registrar invitado:', error);
        // Si falla el backend, limpiar sesión de Firebase
        await AuthService.logout();
        return {
          success: false,
          data: null,
          error: this.extractErrorMessage(error, 'Error al registrar usuario invitado en el backend.')
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: this.extractErrorMessage(error, 'Error al iniciar sesión como invitado.')
      };
    }
  }

  // CONVERT GUEST TO USER: Convertir invitado a usuario permanente
  async convertGuestToUser(password: string, email: string): Promise<CombinedAuthResult> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return {
        success: false,
        data: null,
        error: 'No hay usuario autenticado.'
      };
    }

    try {
      // 1. Vincular cuenta anónima con email/password usando linkWithCredential
      const { linkWithCredential, EmailAuthProvider } = await import('firebase/auth');
      
      // Crear credencial con email/password
      const credential = EmailAuthProvider.credential(email, password);
      
      // Vincular la cuenta anónima con email/password
      const linkedCredential = await linkWithCredential(currentUser, credential);

      // 2. Obtener nuevo token después del link
      const newToken = await linkedCredential.user.getIdToken(true);

      // 3. Convertir en backend
      try {
        const { data: backendResult, message } = await this.postAuthEndpoint('/auth/convert-guest', newToken, {
          idToken: newToken,
          password,
          email
        });

        const usuario = this.mapBackendUserToUsuario(backendResult.user, backendResult.estado);

        return {
          success: true,
          data: {
            firebaseUser: linkedCredential.user,
            firebaseToken: newToken,
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
          error: this.extractErrorMessage(error, 'Error al convertir usuario invitado.')
        };
      }
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error, 'Error al vincular la cuenta con email y contraseña.');
      
      // Si el error es que el email ya está en uso, dar mensaje más claro
      if (errorMessage.includes('email-already-in-use') || errorMessage.includes('already exists')) {
        return {
          success: false,
          data: null,
          error: 'Este email ya está registrado. Por favor, inicia sesión en su lugar.'
        };
      }
      
      return {
        success: false,
        data: null,
        error: errorMessage
      };
    }
  }
}

export default new AuthIntegrationService();
