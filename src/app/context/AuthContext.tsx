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

type AuthContextValue = {
  user: IUsuario | null;
  firebaseUser: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; estado?: number | null; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; estado?: number | null; message?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; message?: string; estado?: number | null }>;
  registerWithGoogle: () => Promise<{ success: boolean; message?: string; estado?: number | null }>;
  completeProfile: (profile: RegisterProfileInput) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (email: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  resendEmailVerification: () => Promise<boolean>;
  resetPassword: (oobCode: string, newPassword: string) => Promise<{ success: boolean; message: string | null }>;
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

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      if (user) {
        try {
          await user.reload();
          setFirebaseUser(user);

          // Si el usuario ya está en el store y es el mismo, no sobrescribir
          const currentUsuario = useAuthStore.getState().usuario;
          if (currentUsuario && currentUsuario.uid === user.uid && lastSyncedUid === user.uid) {
            // Ya está sincronizado, solo actualizar firebaseUser
            setLoading(false);
            return;
          }

          // Sincronizar con backend solo si el email está verificado
          if (user.emailVerified) {
            const syncResult = await AuthIntegrationService.syncCurrentUser();
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
            // Email no verificado, no sincronizar con backend
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
        // Verificar si hay usuario en el store antes de limpiar (puede ser una redirección temporal)
        const currentUsuario = useAuthStore.getState().usuario;
        const currentToken = useAuthStore.getState().token;
        
        // Si hay usuario y token en el store, mantenerlo (puede ser una redirección del middleware)
        if (currentUsuario && currentToken) {
          // No limpiar, solo actualizar firebaseUser
          setFirebaseUser(null);
          setLoading(false);
          return;
        }
        
        // Solo limpiar si realmente no hay usuario en el store
        logoutStore();
        clearAuthCookies();
        setFirebaseUser(null);
        setRole(null);
        lastSyncedUid = null;
      }

      isInitialLoad = false;
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loginStore, logoutStore]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const result = await AuthIntegrationService.login(email, password);

    if (result.success && result.data) {
      loginStore(result.data.firebaseToken, result.data.usuario);
      setFirebaseUser(result.data.firebaseUser);
      setRole(result.data.usuario.rol);
      await syncAuthCookies(result.data.firebaseToken, result.data.usuario.rol, result.data.usuario.estado);
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

    if (result.success && result.data) {
      // Guardar en store primero
      loginStore(result.data.firebaseToken, result.data.usuario);
      setFirebaseUser(result.data.firebaseUser);
      setRole(result.data.usuario.rol);
      
      // Esperar a que las cookies se guarden completamente
      await syncAuthCookies(result.data.firebaseToken, result.data.usuario.rol, result.data.usuario.estado);
      
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
      // No hacer login completo aún, el email debe ser verificado primero
      setFirebaseUser(result.data.firebaseUser);
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
  }, []);

  const registerWithGoogle = useCallback(async () => {
    setLoading(true);
    const result = await AuthIntegrationService.registerWithGoogle();

    if (result.success && result.data) {
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

    if (result.success && result.data) {
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
    const result = await AuthService.forgotPassword(email);
    return result.success;
  }, []);

  const logout = useCallback(async () => {
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
      toast.success('Sesión cerrada correctamente');
      return result.success;
    } catch (error) {
      // Aunque haya error, limpiar el estado local
      console.error('Error al cerrar sesión en Firebase:', error);
      logoutStore();
      clearAuthCookies();
      setFirebaseUser(null);
      setRole(null);
      setLoading(false);
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

  const value = useMemo<AuthContextValue>(
    () => ({
      user: usuario,
      firebaseUser,
      role,
      token,
      isAuthenticated,
      loading,
      login,
      loginWithGoogle,
      register,
      registerWithGoogle,
      completeProfile,
      forgotPassword,
      logout,
      resendEmailVerification,
      resetPassword
    }),
    [
      usuario,
      firebaseUser,
      role,
      token,
      isAuthenticated,
      loading,
      login,
      loginWithGoogle,
      register,
      registerWithGoogle,
      completeProfile,
      forgotPassword,
      logout,
      resendEmailVerification,
      resetPassword
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
