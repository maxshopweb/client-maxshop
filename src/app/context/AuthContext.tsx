'use client';

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import AuthService from '../services/auth.service';
import AuthIntegrationService, { type RegisterProfileInput } from '../services/auth.integration.service';
import { auth } from '../lib/firebase.config';
import { useAuthStore } from '../stores/userStore';
import { type IUsuario, type UserRole } from '../types/user';
import { syncAuthCookies, clearAuthCookies } from '../utils/cookies';
import { toast } from 'sonner';

type GuestData = {
  email: string;
  nombre: string;
  apellido?: string;
  telefono?: string;
};

type AuthContextValue = {
  user: IUsuario | null;
  firebaseUser: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  guestEmail: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; estado?: number | null; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; estado?: number | null; message?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; message?: string; estado?: number | null }>;
  registerWithGoogle: () => Promise<{ success: boolean; message?: string; estado?: number | null }>;
  completeProfile: (profile: RegisterProfileInput) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (email: string) => Promise<boolean>;
  logout: (silent?: boolean) => Promise<boolean>;
  resendEmailVerification: () => Promise<boolean>;
  resetPassword: (oobCode: string, newPassword: string) => Promise<{ success: boolean; message: string | null }>;
  signInAsGuest: (guestData: GuestData) => Promise<{ success: boolean; message?: string }>;
  convertGuestToUser: (password: string, email: string) => Promise<{ success: boolean; message?: string }>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  const token = useAuthStore((state) => state.token);
  const usuario = useAuthStore((state) => state.usuario);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);

  // Sincronizar Firebase con backend cuando cambia el estado de autenticación
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isInitialLoad = true;
    let lastSyncedUid: string | null = null;
    let lastEmailVerified: boolean | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      if (user) {
        try {
          await user.reload();
          setFirebaseUser(user);

          // Obtener usuario del store para verificar estado
          const currentUsuario = useAuthStore.getState().usuario;
          
          // Detectar si el email se acaba de verificar o necesita actualización de estado
          // 1. Si cambió de false a true (detectado por lastEmailVerified)
          // 2. Si el email está verificado pero el estado en el store es 1 o null (no se ha actualizado)
          const emailChangedToVerified = user.emailVerified && lastEmailVerified === false;
          const needsStateUpdate = user.emailVerified && (currentUsuario?.estado === 1 || currentUsuario?.estado === null);
          const emailJustVerified = emailChangedToVerified || needsStateUpdate;
          
          // Actualizar lastEmailVerified
          if (lastEmailVerified === null) {
            lastEmailVerified = user.emailVerified;
          } else if (lastEmailVerified !== user.emailVerified) {
            lastEmailVerified = user.emailVerified;
          }

          // Si el usuario ya está en el store y es el mismo, y el email no se acaba de verificar, no sobrescribir
          if (currentUsuario && currentUsuario.uid === user.uid && lastSyncedUid === user.uid && !emailJustVerified) {
            // Ya está sincronizado y no hay cambios, solo actualizar firebaseUser
            setLoading(false);
            return;
          }

          // Para usuarios anónimos (invitados), sincronizar sin verificar email
          const isAnonymous = !user.email || user.isAnonymous;
          
          // Sincronizar con backend si el email está verificado O si es usuario anónimo (invitado)
          if (user.emailVerified || isAnonymous) {
            let syncResult;
            if (emailJustVerified && !isAnonymous) {
              // Email se acaba de verificar o necesita actualización de estado, usar syncAfterEmailVerification
              console.log('📧 [AuthContext] Email verificado detectado, actualizando estado a 2', { 
                emailChangedToVerified, 
                needsStateUpdate,
                currentEstado: currentUsuario?.estado 
              });
              syncResult = await AuthIntegrationService.syncAfterEmailVerification();
            } else {
              // Email ya estaba verificado o es anónimo, solo sincronizar
              syncResult = await AuthIntegrationService.syncCurrentUser();
            }
            
            if (syncResult.success && syncResult.data && syncResult.data.usuario) {
              // Preservar el estado si ya existe en el store y el nuevo no lo tiene
              const existingEstado = currentUsuario?.estado;
              const newEstado = syncResult.data.usuario.estado ?? existingEstado;
              
              loginStore(syncResult.data.firebaseToken, {
                ...syncResult.data.usuario,
                estado: newEstado
              });
              setRole(syncResult.data.usuario.rol);
              await syncAuthCookies(syncResult.data.firebaseToken, syncResult.data.usuario.rol, newEstado);
              lastSyncedUid = user.uid;
            } else {
              // Si falla la sincronización pero hay usuario en store, mantenerlo
              if (currentUsuario && currentUsuario.uid === user.uid) {
                // Mantener el usuario actual del store y las cookies
                setLoading(false);
                return;
              }
              // Si no hay usuario en store, verificar si hay token antes de cerrar sesión
              const storeToken = useAuthStore.getState().token;
              if (!storeToken) {
                // Solo cerrar sesión si realmente no hay token
                await AuthService.logout();
                logoutStore();
                clearAuthCookies();
                setFirebaseUser(null);
                setRole(null);
              } else {
                // Hay token pero falló la sincronización, mantener el usuario del store
                setLoading(false);
                return;
              }
            }
          } else {
            // Email no verificado y no es anónimo, no sincronizar con backend
            // Pero mantener el usuario si ya está en el store
            if (!currentUsuario || currentUsuario.uid !== user.uid) {
              logoutStore();
              clearAuthCookies();
              setRole(null);
            }
          }
        } catch (error) {
          console.error('Error al sincronizar usuario:', error);
          // Si hay error pero el usuario está en el store, mantenerlo
          const currentUsuario = useAuthStore.getState().usuario;
          if (!currentUsuario || currentUsuario.uid !== user.uid) {
            logoutStore();
            clearAuthCookies();
            setFirebaseUser(null);
            setRole(null);
          }
        }
      } else {
        // No hay usuario de Firebase
        // IMPORTANTE: Si hay token en el store, NO limpiar NUNCA
        // El token en el store significa que el usuario está autenticado
        // Firebase puede no tener usuario temporalmente durante sincronización
        const currentUsuario = useAuthStore.getState().usuario;
        const currentToken = useAuthStore.getState().token;
        
        // Si hay token en el store, mantener TODO (usuario, token, cookies)
        // NO limpiar aunque Firebase no tenga usuario
        if (currentToken) {
          // Mantener el estado del store, solo actualizar firebaseUser
          setFirebaseUser(null);
          setLoading(false);
          return;
        }
        
        // Solo limpiar si NO hay token en el store (usuario realmente deslogueado)
        if (!currentToken && !currentUsuario) {
          console.warn('⚠️ [AuthContext] Limpiando estado - No hay token ni usuario en store');
          logoutStore();
          clearAuthCookies();
          setFirebaseUser(null);
          setRole(null);
          lastSyncedUid = null;
        } else {
          // Hay usuario pero no token - mantener usuario pero no limpiar
          setFirebaseUser(null);
          setLoading(false);
        }
      }

      isInitialLoad = false;
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loginStore, logoutStore]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const result = await AuthIntegrationService.login(email, password);

    if (result.success && result.data && result.data.usuario) {
      console.log('🔐 [AuthContext] Login exitoso, guardando datos:', {
        rol: result.data.usuario.rol,
        estado: result.data.usuario.estado,
        uid: result.data.usuario.uid
      });
      loginStore(result.data.firebaseToken, result.data.usuario);
      setFirebaseUser(result.data.firebaseUser);
      setRole(result.data.usuario.rol);
      console.log('🔐 [AuthContext] Role actualizado en contexto:', result.data.usuario.rol);
      await syncAuthCookies(result.data.firebaseToken, result.data.usuario.rol, result.data.usuario.estado);
      console.log('🔐 [AuthContext] Cookies sincronizadas, role en contexto después:', role);
      setLoading(false);
      return {
        success: true,
        estado: result.data.backend.estado ?? null,
        message: result.message ?? undefined
      };
    }

    setLoading(false);
    return {
      success: false,
      estado: null,
      message: result.error ?? undefined
    };
  }, [loginStore]);

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    const result = await AuthIntegrationService.loginWithGoogle();

    if (result.success && result.data && result.data.usuario) {
      console.log('🔐 [AuthContext] Login con Google exitoso, guardando datos:', {
        rol: result.data.usuario.rol,
        estado: result.data.usuario.estado,
        uid: result.data.usuario.uid
      });
      // Guardar en store primero
      loginStore(result.data.firebaseToken, result.data.usuario);
      setFirebaseUser(result.data.firebaseUser);
      setRole(result.data.usuario.rol);
      console.log('🔐 [AuthContext] Role actualizado en contexto (Google):', result.data.usuario.rol);
      
      // Esperar a que las cookies se guarden completamente
      await syncAuthCookies(result.data.firebaseToken, result.data.usuario.rol, result.data.usuario.estado);
      console.log('🔐 [AuthContext] Cookies sincronizadas (Google), role en contexto después:', role);
      
      setLoading(false);
      return {
        success: true,
        estado: result.data.backend.estado ?? null,
        message: result.message ?? undefined
      };
    }

    setLoading(false);
    return {
      success: false,
      estado: null,
      message: result.error ?? undefined
    };
  }, [loginStore]);

  const register = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const result = await AuthIntegrationService.register(email, password);

    if (result.success && result.data) {
      // Guardar token y usuario en el store INMEDIATAMENTE después del registro
      // Esto es necesario para que el guard no redirija al login
      // El email aún no está verificado, pero el usuario está registrado
      loginStore(result.data.firebaseToken, result.data.usuario);
      setFirebaseUser(result.data.firebaseUser);
      setRole(result.data.usuario.rol);
      // No sincronizar cookies aún porque el email no está verificado
      // Las cookies se sincronizarán cuando se verifique el email
      setLoading(false);
      return {
        success: true,
        message: result.message ?? undefined,
        estado: result.data.backend.estado ?? null
      };
    }

    setLoading(false);
    return {
      success: false,
      message: result.error ?? undefined,
      estado: null
    };
  }, [loginStore]);

  const registerWithGoogle = useCallback(async () => {
    setLoading(true);
    const result = await AuthIntegrationService.registerWithGoogle();

    if (result.success && result.data && result.data.usuario) {
      // Google ya verifica el email, así que hacer login completo
      loginStore(result.data.firebaseToken, result.data.usuario);
      setFirebaseUser(result.data.firebaseUser);
      setRole(result.data.usuario.rol);
      await syncAuthCookies(result.data.firebaseToken, result.data.usuario.rol, result.data.usuario.estado);
      setLoading(false);
      return {
        success: true,
        message: result.message ?? undefined,
        estado: result.data.backend.estado ?? null
      };
    }

    setLoading(false);
    return {
      success: false,
      message: result.error ?? undefined,
      estado: null
    };
  }, [loginStore]);

  const completeProfile = useCallback(async (profile: RegisterProfileInput) => {
    setLoading(true);
    // Usar el token del store como respaldo
    const storeToken = useAuthStore.getState().token;
    const result = await AuthIntegrationService.completeProfile(profile, storeToken || token);

    if (result.success && result.data && result.data.usuario) {
      // Actualizar el store con el nuevo estado (estado 3 = perfil completo)
      loginStore(result.data.firebaseToken, result.data.usuario);
      
      // Si hay usuario de Firebase, actualizarlo
      if (result.data.firebaseUser) {
        setFirebaseUser(result.data.firebaseUser);
      } else {
        // Si no hay usuario de Firebase, intentar obtenerlo
        const firebaseUser = auth.currentUser;
        if (firebaseUser) {
          setFirebaseUser(firebaseUser);
        }
      }
      
      setRole(result.data.usuario.rol);
      await syncAuthCookies(result.data.firebaseToken, result.data.usuario.rol, result.data.usuario.estado);
      setLoading(false);
      return {
        success: true,
        message: result.message ?? undefined
      };
    }

    setLoading(false);
    return {
      success: false,
      message: result.error ?? undefined
    };
  }, [loginStore, token]);

  const forgotPassword = useCallback(async (email: string) => {
    console.log('📧 [AuthContext] forgotPassword llamado para:', email);
    const result = await AuthService.forgotPassword(email);
    console.log('📧 [AuthContext] Resultado de forgotPassword:', { success: result.success, error: result.error });
    if (!result.success && result.error) {
      throw new Error(result.error);
    }
    return result.success;
  }, []);

  const logout = useCallback(async (silent: boolean = false) => {
    setLoading(true);
    
    try {
      // Cerrar sesión en Firebase
      const result = await AuthService.logout();
      
      // Limpiar todo independientemente del resultado de Firebase
      // (por si hay algún error pero queremos limpiar el estado local)
      logoutStore();
      clearAuthCookies();
      setFirebaseUser(null);
      setRole(null);
      
      setLoading(false);
      
      // Solo mostrar toast si no es silencioso (para usuarios invitados después del checkout)
      if (!silent) {
        toast.success('Sesión cerrada correctamente');
      }
      
      // SIEMPRE redirigir a / después del logout
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      
      return result.success;
    } catch (error) {
      // Aunque haya error, limpiar el estado local
      console.error('Error al cerrar sesión en Firebase:', error);
      logoutStore();
      clearAuthCookies();
      setFirebaseUser(null);
      setRole(null);
      setLoading(false);
      
      // SIEMPRE redirigir a / después del logout, incluso si hay error
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      
      return false;
    }
  }, [logoutStore]);

  const resendEmailVerification = useCallback(async () => {
    const result = await AuthService.resendEmailVerification();
    return result.success;
  }, []);

  const resetPassword = useCallback(async (oobCode: string, newPassword: string) => {
    const result = await AuthService.resetPassword(oobCode, newPassword);
    return { success: result.success, message: result.error };
  }, []);

  const signInAsGuest = useCallback(async (guestData: GuestData) => {
    setLoading(true);
    const result = await AuthIntegrationService.signInAsGuest(guestData);

    if (result.success && result.data && result.data.usuario) {
      loginStore(result.data.firebaseToken, result.data.usuario);
      setFirebaseUser(result.data.firebaseUser);
      setRole(result.data.usuario.rol);
      await syncAuthCookies(result.data.firebaseToken, result.data.usuario.rol, result.data.usuario.estado);
      setLoading(false);
      return {
        success: true,
        message: result.message ?? undefined
      };
    }

    setLoading(false);
    return {
      success: false,
      message: result.error ?? undefined
    };
  }, [loginStore]);

  const convertGuestToUser = useCallback(async (password: string, email: string) => {
    setLoading(true);
    const result = await AuthIntegrationService.convertGuestToUser(password, email);

    if (result.success && result.data && result.data.usuario) {
      loginStore(result.data.firebaseToken, result.data.usuario);
      setFirebaseUser(result.data.firebaseUser);
      setRole(result.data.usuario.rol);
      await syncAuthCookies(result.data.firebaseToken, result.data.usuario.rol, result.data.usuario.estado);
      setLoading(false);
      toast.success('Cuenta convertida exitosamente');
      return {
        success: true,
        message: result.message ?? undefined
      };
    }

    setLoading(false);
    return {
      success: false,
      message: result.error ?? undefined
    };
  }, [loginStore]);

  // Determinar si es invitado: estado 1 = invitado (checkout sin registro). Estado 3 = usuario dado de alta.
  const isGuest = useMemo(() => usuario?.estado === 1, [usuario]);
  const guestEmail = useMemo(() => {
    // Para invitados, el email puede estar en email_temporal
    // Por ahora, usamos el email del usuario si existe
    return isGuest ? (usuario?.email ?? null) : null;
  }, [usuario, isGuest]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: usuario,
      firebaseUser,
      role,
      token,
      isAuthenticated,
      isGuest,
      guestEmail,
      loading,
      login,
      loginWithGoogle,
      register,
      registerWithGoogle,
      completeProfile,
      forgotPassword,
      logout,
      resendEmailVerification,
      resetPassword,
      signInAsGuest,
      convertGuestToUser
    }),
    [
      usuario,
      firebaseUser,
      role,
      token,
      isAuthenticated,
      isGuest,
      guestEmail,
      loading,
      login,
      loginWithGoogle,
      register,
      registerWithGoogle,
      completeProfile,
      forgotPassword,
      logout,
      resendEmailVerification,
      resetPassword,
      signInAsGuest,
      convertGuestToUser
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider.');
  }
  return context;
};
