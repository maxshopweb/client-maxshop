import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IUsuario } from '../types/user';

interface AuthState {
  token: string | null;
  usuario: IUsuario | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setUsuario: (usuario: IUsuario | null) => void;
  login: (token: string, usuario: IUsuario) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,
      setToken: (token) => set(() => ({ token, isAuthenticated: !!token })),
      setUsuario: (usuario) => set(() => ({ usuario })),
      login: (token, usuario) => set(() => ({ token, usuario, isAuthenticated: true })),
      logout: () => set(() => ({ token: null, usuario: null, isAuthenticated: false })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        usuario: state.usuario,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
