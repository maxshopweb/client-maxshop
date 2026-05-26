import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../userStore';
import type { IUsuario } from '@/app/types/user';

const createUsuario = (overrides: Partial<IUsuario> = {}): IUsuario => ({
  uid: 'user-1',
  username: 'juanperez',
  nombre: 'Juan',
  apellido: 'Perez',
  email: 'juan@test.com',
  telefono: null,
  nacimiento: null,
  img: null,
  rol: 'USER',
  ...overrides,
});

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ token: null, usuario: null, isAuthenticated: false });
  });

  it('should have correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.usuario).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should set token and mark as authenticated', () => {
    useAuthStore.getState().setToken('test-token');

    const state = useAuthStore.getState();
    expect(state.token).toBe('test-token');
    expect(state.isAuthenticated).toBe(true);
  });

  it('should set token to null and mark as not authenticated', () => {
    useAuthStore.getState().setToken('test-token');
    useAuthStore.getState().setToken(null);

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should set usuario', () => {
    const usuario = createUsuario();
    useAuthStore.getState().setUsuario(usuario);

    expect(useAuthStore.getState().usuario).toEqual(usuario);
  });

  it('should set usuario to null', () => {
    useAuthStore.getState().setUsuario(createUsuario());
    useAuthStore.getState().setUsuario(null);

    expect(useAuthStore.getState().usuario).toBeNull();
  });

  it('should login and set all auth data', () => {
    const usuario = createUsuario();
    useAuthStore.getState().login('login-token', usuario);

    const state = useAuthStore.getState();
    expect(state.token).toBe('login-token');
    expect(state.usuario).toEqual(usuario);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should logout and clear all auth data', () => {
    const usuario = createUsuario();
    useAuthStore.getState().login('login-token', usuario);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.usuario).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
