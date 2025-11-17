import { auth } from '../lib/firebase.config';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  confirmPasswordReset,
  type User,
  type UserCredential
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

type AuthResult<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
};

type AuthPayload = {
  user: User;
  token: string;
};

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/user-not-found': 'La cuenta no existe. Por favor, regístrate primero.',
  'auth/wrong-password': 'Contraseña incorrecta',
  'auth/invalid-login-credentials': 'La cuenta no existe o las credenciales son incorrectas.',
  'auth/invalid-credential': 'La cuenta no existe o las credenciales son incorrectas.',
  'auth/invalid-email': 'Email inválido',
  'auth/user-disabled': 'Usuario deshabilitado',
  'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
  'auth/popup-closed-by-user': 'La ventana de autenticación se cerró antes de finalizar',
  'auth/popup-blocked': 'El navegador bloqueó la ventana de autenticación',
  'auth/email-already-in-use': 'Este email ya está registrado',
  'auth/weak-password': 'La contraseña es demasiado débil',
};

class AuthService {
  private mapFirebaseError(error: unknown, defaultMessage: string): string {
    if (error instanceof FirebaseError) {
      return AUTH_ERROR_MESSAGES[error.code] ?? defaultMessage;
    }
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return defaultMessage;
  }

  private async buildAuthPayload(credential: UserCredential): Promise<AuthPayload> {
    const token = await credential.user.getIdToken();
    return {
      user: credential.user,
      token
    };
  }

  async login(email: string, password: string): Promise<AuthResult<AuthPayload>> {
    try {
      if (!email || !email.trim()) {
        return { success: false, data: null, error: 'El email es requerido' };
      }
      if (!password || !password.trim()) {
        return { success: false, data: null, error: 'La contraseña es requerida' };
      }

      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      return {
        success: true,
        data: await this.buildAuthPayload(credential),
        error: null
      };
    } catch (error: any) {
      const message = this.mapFirebaseError(error, 'Error al iniciar sesión.');
      if (error?.code === 'auth/invalid-login-credentials' || error?.code === 'auth/invalid-credential') {
        return {
          success: false,
          data: null,
          error: 'La cuenta no existe o las credenciales son incorrectas.'
        };
      }
      return { success: false, data: null, error: message };
    }
  }

  async loginWithGoogle(): Promise<AuthResult<AuthPayload>> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      provider.setCustomParameters({ prompt: 'select_account' });

      const credential = await signInWithPopup(auth, provider);
      return {
        success: true,
        data: await this.buildAuthPayload(credential),
        error: null
      };
    } catch (error: any) {
      if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/popup-closed-by-user') {
        return {
          success: false,
          data: null,
          error: 'La ventana de autenticación fue bloqueada o cerrada.'
        };
      }
      const message = this.mapFirebaseError(error, 'Error al iniciar sesión con Google.');
      return { success: false, data: null, error: message };
    }
  }

  async register(email: string, password: string): Promise<AuthResult<AuthPayload>> {
    try {
      if (!email || !email.trim()) {
        return { success: false, data: null, error: 'El email es requerido' };
      }
      if (!password || !password.trim()) {
        return { success: false, data: null, error: 'La contraseña es requerida' };
      }

      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      
      // Enviar email de verificación con URL personalizada
      const actionCodeSettings = {
        url: `${window.location.origin}/register/verify-email`,
        handleCodeInApp: false,
      };
      
      await sendEmailVerification(credential.user, actionCodeSettings);

      return {
        success: true,
        data: await this.buildAuthPayload(credential),
        error: null
      };
    } catch (error) {
      const message = this.mapFirebaseError(error, 'Error al registrar el usuario.');
      return { success: false, data: null, error: message };
    }
  }

  async registerWithGoogle(): Promise<AuthResult<AuthPayload>> {
    // Firebase maneja login y register igual con Google
    return this.loginWithGoogle();
  }

  async forgotPassword(email: string): Promise<AuthResult<void>> {
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: false,
      };
      
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      return { success: true, data: null, error: null };
    } catch (error) {
      const message = this.mapFirebaseError(error, 'Error al enviar el correo de recuperación.');
      return { success: false, data: null, error: message };
    }
  }

  async resendEmailVerification(): Promise<AuthResult<void>> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { success: false, data: null, error: 'No hay usuario autenticado.' };
      }
      if (currentUser.emailVerified) {
        return { success: false, data: null, error: 'El email ya está verificado.' };
      }
      
      const actionCodeSettings = {
        url: `${window.location.origin}/register/verify-email`,
        handleCodeInApp: false,
      };
      
      await sendEmailVerification(currentUser, actionCodeSettings);
      return { success: true, data: null, error: null };
    } catch (error) {
      const message = this.mapFirebaseError(error, 'Error al reenviar el email de verificación.');
      return { success: false, data: null, error: message };
    }
  }

  async resetPassword(oobCode: string, newPassword: string): Promise<AuthResult<void>> {
    try {
      if (!newPassword || !newPassword.trim()) {
        return { success: false, data: null, error: 'La contraseña es requerida' };
      }
      
      await confirmPasswordReset(auth, oobCode, newPassword);
      return { success: true, data: null, error: null };
    } catch (error) {
      const message = this.mapFirebaseError(error, 'Error al restablecer la contraseña. El enlace puede haber expirado o ser inválido.');
      return { success: false, data: null, error: message };
    }
  }

  async logout(): Promise<AuthResult<void>> {
    try {
      await signOut(auth);
      return { success: true, data: null, error: null };
    } catch (error) {
      const message = this.mapFirebaseError(error, 'Error al cerrar sesión.');
      return { success: false, data: null, error: message };
    }
  }
}

export default new AuthService();
