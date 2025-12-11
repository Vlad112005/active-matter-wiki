import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, LoginResponse } from '../types';
import { apiClient } from '../services/api';

interface AuthStore extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setToken: (token: string | null) => void;
  setUser: (user: LoginResponse['user'] | null) => void;
}

export const useAuthStore = create<AuthStore>(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setToken: (token) => {
        set({ token });
        apiClient.setToken(token);
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      register: async (email: string, username: string, password: string) => {
        const response = await apiClient.register({ email, username, password });
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
        apiClient.setToken(response.token);
      },

      login: async (username: string, password: string) => {
        const response = await apiClient.login({ username, password });
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
        apiClient.setToken(response.token);
      },

      logout: async () => {
        await apiClient.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        apiClient.setToken(null);
      },

      // Обновление данных пользователя с сервера
      refreshUser: async () => {
        try {
          const token = get().token;
          if (!token) return;
          
          apiClient.setToken(token);
          const userData = await apiClient.getMe();
          set({ user: userData, isAuthenticated: true });
        } catch (error) {
          console.error('Failed to refresh user:', error);
          // Если токен невалиден - выходим
          set({ user: null, token: null, isAuthenticated: false });
          apiClient.setToken(null);
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // После загрузки из localStorage - обновляем данные с сервера
        if (state?.token) {
          state.refreshUser();
        }
      },
    }
  )
);
