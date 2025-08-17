// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and auth state
      localStorage.removeItem('authToken');
      
      // Import the auth store and update state
      import('../store/authStore').then(({ default: useAuthStore }) => {
        useAuthStore.getState().logout();
      });
      
      // Only redirect if we're not already on login/auth pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/signup') && !currentPath.includes('/verify')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;