import { create } from "zustand";
import type { ResponseInterface } from "../types/response";
import { authApi } from "../lib/actions/auth";
import { showAlert } from "../lib/alert";
import type { LoginPayload, AuthUser } from "../lib/actions/auth";

export interface AuthInterface{
 id: number,
 username: string,
  email: string,
  firstName: string,
  lastName: string,
  gender: string,
  image: string,
  accessToken: string,
  refreshToken: string
}

export type AuthResponse = ResponseInterface<AuthInterface>

interface AuthState {
  user: AuthUser | null;
  isLoadingAuth: boolean;
  isAuthenticated: boolean;

  login: (payload: LoginPayload) => Promise<void>;
  me: () => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => void;
}

const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('token', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoadingAuth: false,
  isAuthenticated: false,

  login: async (payload) => {
    set({ isLoadingAuth: true });
    try {
      const data = await authApi.login(payload);
      saveTokens(data.accessToken, data.refreshToken);
      set({ user: data, isAuthenticated: true });
      showAlert('success', `Welcome back, ${data.firstName}!`);
    } catch (error: any) {
      showAlert('error', error.message, 'Login Failed');
      throw error;
    } finally {
      set({ isLoadingAuth: false });
    }
  },

  me: async () => {
    set({ isLoadingAuth: true });
    try {
      const data = await authApi.me();
      set({ user: data, isAuthenticated: true });
    } catch (error: any) {
      clearTokens();
      set({ user: null, isAuthenticated: false });
      showAlert('error', error.message, 'Session Expired');
      throw error;
    } finally {
      set({ isLoadingAuth: false });
    }
  },

  refresh: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    set({ isLoadingAuth: true });
    try {
      const data = await authApi.refresh( refreshToken );
      saveTokens(data.accessToken, data.refreshToken);
    } catch (error: any) {
      clearTokens();
      set({ user: null, isAuthenticated: false });
      showAlert('error', 'Your session has expired. Please login again.', 'Session Expired');
      throw error;
    } finally {
      set({ isLoadingAuth: false });
    }
  },

  logout: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false });
    showAlert('success', 'You have been logged out successfully.');
  },
}));