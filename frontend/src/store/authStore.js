// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AuthService from '../services/authService';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      initializing: true,

      // Actions
      signup: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await AuthService.signup(userData);
          set({ loading: false });
          return response;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || 'Signup failed'
          });
          throw error;
        }
      },

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await AuthService.login(credentials);

          const { token, user } = response.data;

          if (token && user) {
            localStorage.setItem("authToken", token);
            set({ user, isAuthenticated: true, loading: false });
            return { user, token };
          } else {
            throw new Error("Invalid response from server");
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: error.response?.data?.message || "Login failed",
          });
          throw error;
        }
      },

      verifyEmail: async (email, code) => {
        set({ loading: true, error: null });
        try {
          const response = await AuthService.verifyEmail(email, code);
          set({ loading: false });
          return response;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || 'Verification failed'
          });
          throw error;
        }
      },

      resendVerificationCode: async (email) => {
        set({ loading: true, error: null });
        try {
          const response = await AuthService.resendVerificationCode(email);
          set({ loading: false });
          return response;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || 'Resend failed'
          });
          throw error;
        }
      },

      forgotPassword: async (email) => {
        set({ loading: true, error: null });
        try {
          const response = await AuthService.forgotPassword(email);
          set({ loading: false });
          return response;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || 'Request failed'
          });
          throw error;
        }
      },

      resetPassword: async (email, code, newPassword) => {
        set({ loading: true, error: null });
        try {
          const response = await AuthService.resetPassword(email, code, newPassword);
          set({ loading: false });
          return response;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || 'Reset failed'
          });
          throw error;
        }
      },

      getProfile: async () => {
        set({ loading: true, error: null });
        try {
          const response = await AuthService.getProfile();
          // Fix: Handle the correct response structure
          const userData = response.data?.data || response.data;
          set({
            user: userData,
            isAuthenticated: true,
            loading: false,
          });
          return response;
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: error.response?.data?.message || "Profile fetch failed",
          });
          throw error;
        }
      },

      logout: () => {
        AuthService.logout();
        set({ user: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),

      // Initialize auth state - now validates token
      initializeAuth: async () => {
        set({ initializing: true });
        const token = localStorage.getItem('authToken');

        if (!token) {
          set({ isAuthenticated: false, initializing: false });
          return;
        }

        try {
          // Validate token by fetching profile
          const response = await AuthService.getProfile();
          // Fix: Handle the correct response structure
          const userData = response.data?.data || response.data;
          set({
            user: userData,
            isAuthenticated: true,
            initializing: false
          });
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
          set({
            user: null,
            isAuthenticated: false,
            initializing: false
          });
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;